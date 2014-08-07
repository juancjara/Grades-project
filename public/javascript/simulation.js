var simulation = function(eva) {
  var sons = eva.getSons(),
    weights = 0,
    bounds = {lower:0, upper: 0},
    minVal = {lower:21, upper: 21},
    minWeight=  {lower: 0, upper: 0},
    weightBound = {lower: 0, upper: 0};

  if (!sons.length && !eva.getLocked()){
      return {lower: 0 , upper : 20};
  }
  if (!sons.length){
      return eva.getBounds();
  }
  
  for (var i = 0 ; i < sons.length ; i++) {
      var temp = logic.simulation(sons[i]),
          weight = sons[i].getWeight();
      bounds.lower += temp.lower* weight;
      bounds.upper += temp.upper* weight;
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

  if (eva.shouldDeleteMinimum()){
    bounds.lower -= minVal.lower;
    bounds.upper -= minVal.upper;
    weightBound.lower -= minWeight.lower;
    weightBound.upper -= minWeight.upper;
  }

  bounds.lower /= weightBound.lower;
  bounds.upper /= weightBound.upper;
  var precision = eva.getPrecision();
  bounds.lower = Math.floor(bounds.lower * precision) / precision;
  bounds.upper = Math.floor(bounds.upper * precision) / precision;
  eva.setBounds(bounds);
  return bounds;
}