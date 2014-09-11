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
  getInitialState: function() {
    return {focus: this.props.editClass == 'visible'};
  },
  handleBlur: function() {
    var newValue = this.refs.newValue.getDOMNode().value;
    this.props.stopEdit(newValue);
  },
  handleChange: function(e) {
  },
  render: function() {
    var className = 'eva-edit '+ this.props.editClass;
    return (
      <div className={className}>
        <input type='text' 
          ref='newValue'
          onBlur = {this.handleBlur} 
          onChange = {this.handleChange} />
      </div>
    );
  }
});

var EvaluationList = React.createClass({
  startEdit: function(i) {
    this.props.startEdit(i);
  },
  render: function() {
    var visibles = this.props.visibles;
    return (
      <ul className='eva-list list-hori'>
        {this.props.evals.map(function(item, i) {
          var classElem = 'evaluation note '+ visibles[i];
          var editClass = visibles[i] == 'visible' ? 'not-visible': 'visible';
          return (
            <li key={i} >
              <div ref='eval' onClick={this.startEdit.bind(null,i)} className={classElem}>
                <span className='big'>{item.bounds.upper}</span>
                <span onClick={this.props.onRemove.bind(null, i)}> elim</span>
              </div>
              <EvaluationEdit editClass={editClass} ref='edit' stopEdit={this.props.stopEdit.bind(null, i)} />
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
  startEdit: function(index, el) {
    var visibles = this.state.visibles;
    visibles[this.state.editIndex] = 'visible';
    visibles[index] = 'not-visible';
    var value = this.state.evals[index].bounds.upper;
    this.setState({
      visibles : visibles,
      editIndex: index
    });
   $('.eva-edit').find('input').val(value);
  },
  toggleDeleteMin: function() {
    this.state.elem.deleteMin = 1 - this.state.elem.deleteMin;
    this.props.simulate();
    this.setState({
      elem : this.state.elem
    });
  },
  stopEdit: function(index, newValue){
    var visibles = this.state.visibles;
    var evaluations = this.state.evals;
    evaluations[index].bounds.upper = parseInt(newValue);
    visibles[index] = 'visible';
    this.setState({
      visibles: visibles,
      eval: evaluations
    });
    //var evalEdit = this.refs.edit.getDOMNode();
    //$(evalEdit).hide();
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
          visibles = {this.state.visibles}
          stopEdit={this.stopEdit} />
        <div
          className='evaluation note phanthom'
          onClick={this.addEvaluation}>
          <span className='big'>?</span>
        </div>
      </div>
    );
  }
});

var GradeBox = React.createClass({
  getInitialState: function() {
    return {data: this.props.data};
  },
  simulate: function() {
    function simulation(node) {
      var weights = 0;
      var bounds = {lower: 0, upper: 0};
      var minVal = {lower: 21, upper: 21};
      var minWeight =  {lower: 0, upper: 0};
      var weightBound = {lower: 0, upper: 0};
      var childrenLength= node.children.length;

      if (childrenLength == 0) {
        return node.bounds;
      }
      for (var i = 0; i < node.children.length; i++) {
        var actualNode = node.children[i];
        var temp = simulation(actualNode);
        
        var weight = actualNode.weight;
        bounds.lower += temp.lower * weight;
        bounds.upper += temp.upper * weight;
        weights += weight;

        if (temp.lower < minVal.lower){
          minVal.lower = temp.lower;
          minWeight.lower = weight;
        }

        if (temp.upper < minVal.upper){
          minVal.upper = temp.upper;
          minWeight.upper = weight;
        }
      }

      weightBound.lower = weights;
      weightBound.upper = weights;

      if (node.deleteMin) {
        bounds.lower -= minVal.lower * minWeight.lower;
        bounds.upper -= minVal.upper * minWeight.upper;
        weightBound.lower -= minWeight.lower;
        weightBound.upper -= minWeight.upper;
      }

      bounds.lower /= weightBound.lower;
      bounds.upper /= weightBound.upper;

      var precision = +Math.pow(10, node.decimals);
      var round = node.trunk == 0 ? 0.5:0.0;
      bounds.lower = Math.floor(bounds.lower * precision + round) / precision;
      bounds.upper = Math.floor(bounds.upper * precision + round) / precision;
      node.bounds = bounds;

      return bounds;
    }
    var nodes = this.state.data;
    simulation(nodes);
    this.setState({
      data: nodes
    });
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
