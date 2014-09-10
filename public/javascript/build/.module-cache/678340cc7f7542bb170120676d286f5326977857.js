/** @jsx React.DOM */
var AverageData = React.createClass({displayName: 'AverageData',
  render: function() {
    return (
      React.DOM.div({className: "eva-info"}, 
        React.DOM.span(null, this.props.weight), 
        React.DOM.span(null, "x"), 
        React.DOM.span(null, this.props.label), 
        React.DOM.span(null, " = "), 
        React.DOM.span(null, this.props.average)
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
  render: function() {
    return (
      React.DOM.div({id: "edit", className: "eva-edit not-visible"}, 
        React.DOM.input({type: "text", 
          ref: "newValue", 
          onBlur: this.handleBlur, 
          onChange: this.handleChange})
      )
    );
  }
});

var EvaluationList = React.createClass({displayName: 'EvaluationList',
  startEdit: function(i) {
    var el = $(this.getDOMNode()).find('#'+i)
    this.props.startEdit(i, el);
  },
  render: function() {
    var visibles = this.props.visibles;
    return (
      React.DOM.ul({className: "eva-list list-hori"}, 
        this.props.evals.map(function(item, i) {
          return (
            React.DOM.li({key: i, id: i}, 
              React.DOM.div({onClick: this.startEdit.bind(null,i), className: visibles[i]}, 
                React.DOM.span(null, item.bounds.upper), 
                React.DOM.span({onClick: this.props.onRemove.bind(null, i)}, " elim")
              )
            )
          );
        }, this)
      )
    );
  }
});

var AverageBox = React.createClass({displayName: 'AverageBox',
  getInitialState: function() {
    return {evals: this.props.evals, indexEdit:'', visibles: []};
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
    $(evalEdit).appendTo(el).show().
      find('input').val(value).focus();
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
    console.log("gg");
    var evaluations = this.state.evals;
    var visibles = this.state.visibles;
    visibles[evaluations.length] = 'visible';
    var newEval = {
      id: evaluations.length,
      bounds: {
        upper: 20,
        lower: 0
      }
    };
    evaluations = evaluations.push(newEval);
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
      React.DOM.div({className: "average-block"}, 
        AverageData({
          weight: this.props.weight, 
          label: this.props.label, 
          average: this.props.average}), 
        EvaluationList({onRemove: this.onRemove, 
          startEdit: this.startEdit, 
          evals: this.state.evals, 
          visibles: this.state.visibles}), 
        React.DOM.span({onClick: this.addEvaluation}, "mas"), 
        EvaluationEdit({ref: "edit", stopEdit: this.stopEdit})
      )
    );
  }
});

var GradeBox = React.createClass({displayName: 'GradeBox',
  getInitialState: function() {
    return {data: this.props.data};
  },
  render: function() {
    return (
      React.DOM.div({className: "grades-box"}, 
        React.DOM.h1(null, "GG"), 
        this.state.data.children.map(function(item, i) {
          return (
            AverageBox({key: i, 
              weight: item.weight, 
              label: item.label, 
              average: item.bounds.upper, 
              evals: item.children})
          );
        }, this)
      )
    );
  }
});