
var SimpleView = function() {
  var rootNode = document.getElementById('simple-container');
  var data;
  var exports =  {
    cleanSvg: function() {
      React.unmountComponentAtNode(rootNode);
    },
    import: function(dataParam) {
      data = dataParam;
      exports.cleanSvg();
      React.renderComponent(
        GradeBox({data : dataParam}),
        rootNode
      );
    },
    newTree: function() {
      exports.cleanSvg();
    },
    parseFormula: function(formula) {
      var json = NodeMgr.formulaToJson(formula);
      exports.import(json);
    },
    export: function() {
      return data;
    },
    createNode: function() {
      return {
        bounds: {
          upper: 20,
          lower: 0
        },
        label: 'label',
        children: [],
        decimals: 2,
        deleteMin: 0,
        isEditable: true,
        trunk: 0,
        weight: 1
      }
    },
    startEdit: function(el) {
      var temp = $('.eva-edit');
      //console.log('el', el.find('input').val('GGG').focus());
      //console.log(temp.innerHtml);
      return ;
      for (var i = 0; i < temp.length; i++) {
        console.log($(temp[i]).attr('class'));
      }
      
      /*$(document).on('click.edit', function(e) {
        e.stopPropagation();
        console.log(handleStop);
        handleStop();
        console.log('gg');
        exports.stopEdit();
      });*/
    },
    stopEdit: function() {
      $(document).off('click.edit');
    }
  };
  return exports;
};
