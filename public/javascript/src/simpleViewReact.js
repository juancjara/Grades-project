/** @jsx React.DOM */

var AverageData = React.createClass({
  render: function() {
    var val ='elimina mínimo';
    var yesActive = [
      'btn-default',
      'btn-info active'
    ];
    var noActive = [
      'btn-info active',
      'btn-default'
    ];
    var className = 'visible';
    if (this.props.count < 2) {
      className = 'not-visible';
    }
    return (
      <ul className='list-hori'>
        <li>
          <div className='eva-info'>
            <span className='big'>{this.props.label}</span>
            <span>{'x' + this.props.weight}</span>
          </div>
        </li>
        <li>
          <div className='eva-info small'>
            <span className='big'> = </span>
          </div>
        </li>
        <li>
          <div className='eva-info'>
            <span className='big'>{this.props.average}</span>
              <div 
                className={className+" elimina-minimo btn-group btn-toggle"}
                onClick={this.props.toggleDeleteMin}> 
                <button 
                  className={"btn btn-xs "+yesActive[this.props.deleteMin]}>
                    Si
                </button>
                <button 
                  className={"btn btn-xs "+noActive[this.props.deleteMin]}>
                    No
                </button>
              </div>
              <span 
                onClick={this.props.toggleDeleteMin} 
                className={className}>
                {val}
              </span>
          </div>
        </li>
        <li>
          <div className="eva-info small"> 
            <span className="glyphicon glyphicon-chevron-right"></span>
          </div>
        </li> 
      </ul>
    );
  }
});

var EvaluationEdit = React.createClass({
  handleBlur: function() {
    var newValue = this.refs.newValue.getDOMNode().value;
    this.props.stopEdit(newValue);
  },
  handleChange: function(e) {
  },
  componentDidUpdate  : function(data) {
    $(this.getDOMNode()).find('input').focus();
  },
  render: function() {
    var className = 'eva-edit '+ this.props.editClass;
    return (
      <div className={className}>
        <input 
          type='text' 
          ref='newValue'
          onBlur = {this.handleBlur} 
          onChange = {this.handleChange} 
          defaultValue={this.props.val} />
      </div>
    );
  }
});

var EvaluationList = React.createClass({
  render: function() {
    var visibles = this.props.visibles;
    return (
      <ul className='eva-list list-hori'>
        {this.props.evals.map(function(item, i) {
          var classElem = 'evaluation note '+ visibles[i];
          var editClass = 'evaluation note '+ 
                          (visibles[i] == 'visible' ? 'not-visible': 'visible');
          var classLock= item.lock ? 'fa fa-lock': 'fa fa-unlock';
          return (
            <li key={i} id={i}>
              <div 
                ref='eval' 
                onClick={this.props.startEdit.bind(null,i)} 
                className={classElem}>
                <span className='big'>{item.bounds.upper}</span>
                <span 
                  className="eliminar glyphicon glyphicon-remove"
                  onClick={this.props.onRemove.bind(null, i)}> 
                </span>
                <span className='lock-value'>
                  <i 
                    className={classLock}
                    onClick= {this.props.toggleLock.bind(null,i)}>
                  </i>
                </span>
              </div>
              <EvaluationEdit 
                val={item.bounds.upper} 
                editClass={editClass} 
                ref='edit' 
                stopEdit={this.props.stopEdit.bind(null, i)} />
            </li>
          );
        }, this)}
      </ul>
    );
  }
});

var AverageBox = React.createClass({
  getInitialState: function() {
    var temp = []
    for (var i = 0; i < this.props.evals.length ; i++) {
      temp = temp.concat(['visible']);
    }
    return {
      evals: this.props.evals, 
      visibles: temp,
      elem: this.props.elem,
      editIndex: 0
    };
  },
  startEdit: function(index, e) {
    var visibles = this.state.visibles;
    visibles[this.state.editIndex] = 'visible';
    visibles[index] = 'not-visible';
    var value = this.state.evals[index].bounds.upper;
    $(e.target.parentNode.parentNode).find('input').val(value);
    this.setState({
      visibles : visibles,
      editIndex: index
    });
  },
  toggleDeleteMin: function() {
    this.state.elem.deleteMin = 1 - this.state.elem.deleteMin;
    this.setState({
      elem : this.state.elem
    });
    this.props.simulate();
  },
  stopEdit: function(index, newValue){
    var visibles = this.state.visibles;
    var evaluations = this.state.evals;
    var lastValue = evaluations[index].bounds.upper ;
    evaluations[index].bounds.upper = +Math.round(parseFloat(newValue));
    visibles[index] = 'visible';
    this.setState({
      visibles: visibles,
      eval: evaluations
    });  
    this.props.simulate();
  },
  addEvaluation: function() {
    var evaluations = this.state.evals;
    var visibles = this.state.visibles;
    visibles = visibles.concat(['visible']);
    var newEval = simpleView.createNode();
    evaluations.push(newEval);
    this.setState({
      evals: evaluations,
      visibles: visibles
    });
    this.props.simulate();
  },
  onRemove: function(index, e) {
    var evaluations = this.state.evals;
    if(evaluations.length > 1)
    {
      evaluations.splice(index, 1);
      this.setState({
        evals: evaluations
      });
      this.props.simulate();
    }
    e.stopPropagation();
  },
  toggleLock: function(index, e) {
    var evaluations = this.state.evals;
    evaluations[index].lock = !evaluations[index].lock;
    this.setState({evals : evaluations});
    e.stopPropagation();
    if (myCourseView) {
      $("#save-formula").popover('show');
    }
  },
  render: function() {
    return (
      <div className='average-block'>
        <AverageData
          count = {this.state.evals.length}
          weight={this.state.elem.weight}
          label={this.state.elem.label}
          deleteMin={this.state.elem.deleteMin}
          average={this.state.elem.bounds.upper} 
          toggleDeleteMin={this.toggleDeleteMin} />
        <EvaluationList 
          onRemove={this.onRemove} 
          startEdit={this.startEdit}
          evals={this.state.evals}
          visibles = {this.state.visibles}
          toggleLock = {this.toggleLock}
          stopEdit={this.stopEdit} />
        <div
          className='evaluation note phanthom'
          onClick={this.addEvaluation}>
          <span className='big'>+</span>
        </div>
      </div>
    );
  }
});

var GradeBox = React.createClass({
  getInitialState: function() {
    return {
      data: this.props.data,
      visible: 'not-visible'
    };
  },
  simulate: function() {
    var nodes = this.state.data;
    Algorithm.simulation(nodes);
    this.setState({
      data: nodes
    });
    if (myCourseView) {
      $("#save-formula").popover('show');
    }
  },
  startUpdateAverage: function(e) {
    this.setState({visible: 'visible'});
    var value = this.state.data.bounds.upper;
    $(e.target.parentNode.parentNode).find('input').val(value);
  },
  stopUpdateAverage: function(newValue) {
    var newData = this.state.data;
    var lastValue = this.state.data.bounds.upper;
    newData.bounds.upper = parseFloat(newValue);
    this.setState({
      data: newData,
      visible: 'not-visible'
    });
    if (newValue != ''+ lastValue) {
      this.fillGradesToAverage();
    }
  },
  fillGradesToAverage: function() {
    var lastState = this.state.data;
    var wishValue = this.state.data.bounds;

    var nodes = this.state.data;
    
    Algorithm.fillGradesToAverage(nodes, wishValue);
    this.setState({
      data: nodes
    });
  },
  render: function() {
    var className = this.state.visible == 'visible' ? 'not-visible': 'visible';
    return (
      <div className='grades-box'>
        <div 
          className='eva-info big'
          onClick= {this.startUpdateAverage}>
          <div className= {className} >
            <span className='big'>{this.state.data.label}</span>
            <span className='big'>{this.state.data.bounds.upper}</span>
          </div>
          <AverageEdit
            val= {this.state.data.bounds.upper} 
            stopEdit= {this.stopUpdateAverage}
            editClass= {this.state.visible}
            label= {this.state.data.label} />
        </div>
        <div className='notes-box eva-list'>
          {this.state.data.children.map(function(item, i) {
            return (
              <AverageBox 
                key={i}
                elem={item}
                evals={item.children}
                simulate={this.simulate} />
            );
          }, this)}
        </div>
      </div>
    );
  }
});

var AverageEdit = React.createClass({
  handleBlur: function() {
    var newValue = this.refs.newValue.getDOMNode().value;
    this.props.stopEdit(newValue);
  },
  handleChange: function(e) {
  },
  componentDidUpdate  : function(data) {
    $(this.getDOMNode()).find('input').focus();
  },
  render: function() {
    var className = 'ave-edit '+ this.props.editClass;
    return (
      <div className={className}>
        <span>
          {this.props.label}          
        </span>
        <input
          type='text' 
          ref='newValue'
          onBlur = {this.handleBlur} 
          onChange = {this.handleChange} 
          defaultValue={this.props.val} />
      </div>
    );
  }
});