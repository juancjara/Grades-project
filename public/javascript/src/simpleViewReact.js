/** @jsx React.DOM */

var AverageData = React.createClass({
  render: function() {
    var val ='ElimMin';
    if (this.props.deleteMin == 0) {
      val = 'NoElimMin';
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
          <div className='eva-info'>
            <span className='big'> = </span>
          </div>
        </li>
        <li>
          <div className='eva-info'>
            <span className='big'>{this.props.average}</span>
            <span onClick={this.props.toggleDeleteMin}>
              {val}
            </span>
          </div>
        </li>
        <li>
          <div className="eva-info"> 
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
  render: function() {
    return (
      <div className='eva-edit'>
        <input type='text' 
          ref='newValue'
          onBlur = {this.handleBlur} 
          onChange = {this.handleChange}/>
      </div>
    );
  }
});

var EvaluationList = React.createClass({
  startEdit: function(i) {
    var el = $(this.getDOMNode()).find('#'+i)
    this.props.startEdit(i, el);
  },
  render: function() {
    var visibles = this.props.visibles;
    return (
      <ul className='eva-list list-hori'>
        {this.props.evals.map(function(item, i) {
          var classElem = 'evaluation note '+ visibles[i];
          return (
            <li key={i} id={i}>
              <div onClick={this.startEdit.bind(null,i)} className={classElem}>
                <span className='big'>{item.bounds.upper}</span>
                <span onClick={this.props.onRemove.bind(null, i)}> elim</span>
              </div>
            </li>
          );
        }, this)}
      </ul>
    );
  }
});

var AverageBox = React.createClass({
  getInitialState: function() {
    return {
      evals: this.props.evals, 
      indexEdit:'', 
      visibles: [],
      elem: this.props.elem
    };
  },
  startEdit: function(index, el) {
    var visibles = this.state.visibles;
    visibles[index] = 'not-visible';
    var value = this.state.evals[index].bounds.upper;
    this.setState({
      indexEdit: index,
      visibles : visibles
    });
    var evalEdit = this.refs.edit.getDOMNode();
    $(evalEdit).appendTo(el).
      css({'display':'inline-block'}).
      find('input').val(value).focus();
  },
  toggleDeleteMin: function() {
    this.state.elem.deleteMin = 1 - this.state.elem.deleteMin;
    this.setState({
      elem : this.state.elem
    });
  },
  stopEdit: function(newValue){
    var visibles = this.state.visibles;
    var evaluations = this.state.evals;
    var index = this.state.indexEdit;
    evaluations[index].bounds.upper =  newValue;
    visibles[index] = 'visible';
    this.setState({
      editElem: {},
      visibles: visibles,
      eval: evaluations
    });
    var evalEdit = this.refs.edit.getDOMNode();
    $(evalEdit).hide();
  },
  addEvaluation: function() {
    var evaluations = this.state.evals;
    var visibles = this.state.visibles;
    visibles[evaluations.length] = 'visible';
    var newEval = simpleView.createNode();
    evaluations.push(newEval);
    this.setState({
      evals: evaluations,
      visibles: visibles
    });
  },
  onRemove: function(index, e) {
    var evaluations = this.state.evals;
    evaluations.splice(index, 1);
    this.setState({evals: evaluations});
    e.stopPropagation();
  },
  render: function() {
    return (
      <div className='average-block'>
        <AverageData 
          weight={this.state.elem.weight}
          label={this.state.elem.label}
          deleteMin={this.state.elem.deleteMin}
          average={this.state.elem.bounds.upper} 
          toggleDeleteMin={this.toggleDeleteMin}/>
        <EvaluationList onRemove={this.onRemove} 
          startEdit={this.startEdit}
          evals={this.state.evals}
          visibles = {this.state.visibles}/>
        <div
          className='evaluation note phanthom'
          onClick={this.addEvaluation}>
          <span className='big'>?</span>
        </div>
        <EvaluationEdit ref='edit' stopEdit={this.stopEdit} />
      </div>
    );
  }
});

var GradeBox = React.createClass({
  getInitialState: function() {
    return {data: this.props.data};
  },
  render: function() {
    return (
      <div className='grades-box'>
        <div className='eva-info'>
          <span className='big'>{this.state.data.label}</span>
          <span className='big'>{this.state.data.bounds.upper}</span>
        </div>
        <div className='eva-list'>
          {this.state.data.children.map(function(item, i) {
            return (
              <AverageBox key={i}
                elem={item}
                evals={item.children} />
            );
          }, this)}
        </div>
      </div>
    );
  }
});
