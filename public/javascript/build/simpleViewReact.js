/** @jsx React.DOM */

var AverageData = React.createClass({displayName: 'AverageData',
  render: function() {
    var val ='ElimMin';
    var yesActive = [
      'active btn-primary btn-default',
      'btn-info',
    ];
    var noActive = [
      'btn-info btn-default',
      'active btn-primary',
    ];
    var className = 'visible';
    if (this.props.count < 2) {
      className = 'not-visible';
    }
    if (this.props.deleteMin == 0) {
      val = 'NoElimMin';
    }
    return (
      React.DOM.ul({className: "list-hori"}, 
        React.DOM.li(null, 
          React.DOM.div({className: "eva-info"}, 
            React.DOM.span({className: "big"}, this.props.label), 
            React.DOM.span(null, 'x' + this.props.weight)
          )
        ), 
        React.DOM.li(null, 
          React.DOM.div({className: "eva-info small"}, 
            React.DOM.span({className: "big"}, " = ")
          )
        ), 
        React.DOM.li(null, 
          React.DOM.div({className: "eva-info"}, 
            React.DOM.span({className: "big"}, this.props.average), 
              React.DOM.span({
                onClick: this.props.toggleDeleteMin, 
                className: className}, 
                val
              ), 
              React.DOM.div({
                className: className+" elimina-minimo btn-group btn-toggle", 
                onClick: this.props.toggleDeleteMin}, 
                React.DOM.button({
                  className: "btn btn-xs "+yesActive[this.props.deleteMin]}, 
                  "Yes"
                ), 
                React.DOM.button({
                  className: "btn btn-xs "+noActive[this.props.deleteMin]}, 
                    "No"
                )
              )
          )
        ), 
        React.DOM.li(null, 
          React.DOM.div({className: "eva-info small"}, 
            React.DOM.span({className: "glyphicon glyphicon-chevron-right"})
          )
        )
      )
    );
  }
});

var EvaluationEdit = React.createClass({displayName: 'EvaluationEdit',
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
      React.DOM.div({className: className}, 
        React.DOM.input({
          type: "text", 
          ref: "newValue", 
          onBlur: this.handleBlur, 
          onChange: this.handleChange, 
          defaultValue: this.props.val}
          )
      )
    );
  }
});

var EvaluationList = React.createClass({displayName: 'EvaluationList',
  render: function() {
    var visibles = this.props.visibles;
    return (
      React.DOM.ul({className: "eva-list list-hori"}, 
        this.props.evals.map(function(item, i) {
          var classElem = 'evaluation note '+ visibles[i];
          var editClass = 'evaluation note '+ 
                          (visibles[i] == 'visible' ? 'not-visible': 'visible');
          return (
            React.DOM.li({key: i, id: i}, 
              React.DOM.div({
                ref: "eval", 
                onClick: this.props.startEdit.bind(null,i), 
                className: classElem}, 
                React.DOM.span({className: "big"}, item.bounds.upper), 
                React.DOM.span({
                  className: "eliminar glyphicon glyphicon-remove", 
                  onClick: this.props.onRemove.bind(null, i)}
                )
              ), 
              EvaluationEdit({
                val: item.bounds.upper, 
                editClass: editClass, 
                ref: "edit", 
                stopEdit: this.props.stopEdit.bind(null, i)})
            )
          );
        }, this)
      )
    );
  }
});

var AverageBox = React.createClass({displayName: 'AverageBox',
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
    simpleView.stopEdit();
    var visibles = this.state.visibles;
    var evaluations = this.state.evals;
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
  render: function() {
    return (
      React.DOM.div({className: "average-block"}, 
        AverageData({
          count: this.state.evals.length, 
          weight: this.state.elem.weight, 
          label: this.state.elem.label, 
          deleteMin: this.state.elem.deleteMin, 
          average: this.state.elem.bounds.upper, 
          toggleDeleteMin: this.toggleDeleteMin}), 
        EvaluationList({
          onRemove: this.onRemove, 
          startEdit: this.startEdit, 
          evals: this.state.evals, 
          visibles: this.state.visibles, 
          stopEdit: this.stopEdit}), 
        React.DOM.div({
          className: "evaluation note phanthom", 
          onClick: this.addEvaluation}, 
          React.DOM.span({className: "big"}, "+")
        )
      )
    );
  }
});

var GradeBox = React.createClass({displayName: 'GradeBox',
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
      React.DOM.div({className: "grades-box"}, 
        React.DOM.div({className: "eva-info big"}, 
          React.DOM.span({className: "big"}, this.state.data.label), 
          React.DOM.span({className: "big"}, this.state.data.bounds.upper)
        ), 
        React.DOM.div({className: "notes-box eva-list"}, 
          this.state.data.children.map(function(item, i) {
            return (
              AverageBox({
                key: i, 
                elem: item, 
                evals: item.children, 
                simulate: this.simulate})
            );
          }, this)
        )
      )
    );
  }
});
