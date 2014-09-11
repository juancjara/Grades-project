/** @jsx React.DOM */
var AverageData = React.createClass({
  render: function() {
    var val ='ElimMin';
    if (this.props.deleteMin == 0) {
      val = 'NoElimMin';
    }
    return (
      <div className='eva-info'>
        <span>{this.props.weight}</span>
        <span>x</span>
        <span>{this.props.label}</span>
        <span> = </span>
        <span>{this.props.average}</span>
        <span onClick={this.props.toggleDeleteMin}>
          {val}
        </span>
      </div>
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
          var classElem = 'evaluation '+ visibles[i];
          return (
            <li key={i} id={i}>
              <div onClick={this.startEdit.bind(null,i)} className={classElem}>
                <span>{item.bounds.upper}</span>
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
    evaluations[index].bounds.upper = parseInt(newValue);
    visibles[index] = 'visible';
    this.setState({
      editElem: {},
      visibles: visibles,
      eval: evaluations
    });
    var evalEdit = this.refs.edit.getDOMNode();
    $(evalEdit).hide();
    this.props.simulate();
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
        <span onClick={this.addEvaluation}>mas</span>
        <EvaluationEdit ref='edit' stopEdit={this.stopEdit} />
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
          <span>{this.state.data.label}</span>
          <span>{this.state.data.bounds.upper}</span>
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