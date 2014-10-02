var Algorithm = {
  simulation: function (nodes) {
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
    simulation(nodes);
  },
  fillGradesToAverage: function(nodes, wishValue) {
    function fillLeefs(node, value) {
      var children = node.children;
      var childrenLength = children.length;
      if (childrenLength == 0 && !node.lock) {
        node.bounds = value;
      }
      for (var i = 0; i < children.length; i++) {
        fillLeefs(children[i], value);
      };
    }
    var testValue = {
      upper: 0,
      lower: 0
    };
    for (var i = 0; i < 21; i++) {
      testValue.upper = testValue.lower = i;
      fillLeefs(nodes, testValue);
      Algorithm.simulation(nodes);
      if(nodes.bounds.upper > wishValue.upper) {
        break;
      }
    };
  },
  print: function(nodes){
    function print(node) {
      var children = node.children;
      var childrenLength = children.length;
      for (var i = 0; i < children.length; i++) {
        print(children[i]);
      };
    }
    print(nodes);
  }
}