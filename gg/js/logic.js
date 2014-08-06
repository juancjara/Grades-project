var logic = {
    config:{
        minGrade: 10.5,
        evas : {},
        parent : null
    },
    init: function (){
        var id = 0;
        var parent = new Evaluation(
            { name : "pro",weight : 1,locked : false, precision:100 , id : id}
        );
        logic.config.evas[id++] = parent;
        var arr2 = new Array();
        var son2 = new Evaluation(
          { name : "pa",weight : 1,locked : false,deleteMin : true,precision:10, id : id}
        );
        logic.config.evas[id++] = son2;
        var son = new Evaluation(
          { name : "pa1",weight : 1, value : 5,locked : true, id : id}
        );
        arr2.push( son );
        logic.config.evas[id++] = son;
        son = new Evaluation(
          { name : "pa2",weight : 1,value : 6,locked : true, id : id}
        );
        arr2.push( son );
        logic.config.evas[id++] = son;
        son = new Evaluation(
          { name : "pa3",weight : 1,locked : false, id : id}
        );
        arr2.push( son );
        logic.config.evas[id++] = son;
        son2.setSons(arr2);
        var arr = new Array();
        
        son = new Evaluation(
          { name : "pb",weight : 1, value : 12,locked : true, id : id}
        );
        arr.push( son );
        logic.config.evas[id++] = son;
        son = new Evaluation(
          { name : "ex1",weight : 1,value : 12,locked : true, id : id}
        );
        arr.push( son );
        logic.config.evas[id++] = son;
        son = new Evaluation(
          { name : "ex2",weight : 1,locked : false, id : id}
        );
        arr.push( son );
        arr.push( son2 );
        logic.config.evas[id++] = son;
        parent.setSons(arr);

        logic.config.parent = parent;
        $("#json").html(JSON.stringify(parent));
        /*var i,
            finalGrade;
        for (i = 0; i < 21 ; i++){
            finalGrade = logic.execute( parent , i);
            console.log("i "+i+" "+finalGrade);
            if ( finalGrade >= logic.config.minGrade){
                break;
            }
        } 
        logic.showDic();
        console.log("resultado i : "+i+ " promedio alcanzable : "+finalGrade);
        logic.draw(parent,"gg");
        logic.draw(parent,"simulate");*/

    logic.draw(parent,"simulate");

        $("#simulate .simu").on('click',function(){
            var temp = !logic.config.evas[this.parentNode.id].getLocked();
            logic.config.evas[this.parentNode.id].setLocked(temp);
        });
        $("#btnSimulate").on('click.simulate',logic.simulate)
        //console.log("show");
        //logic.show( parent );
    },
    simulate: function(){
        console.log("simulation");
        $("#ff").empty();
        logic.updateValues();
        //logic.showDicAll();
        logic.simulation( logic.config.parent );
        logic.draw( logic.config.parent , "ff");
    },
    updateValues : function(){
        for (var key in logic.config.evas) {
            var elem = logic.config.evas[key];
            if ( elem.getLocked()){
                elem.setValue( parseInt($("#simulate").find("#"+key+" input[type=text]").val()) );
            }
        }
        //$("#0 input[type=text]").val();
    },
    showDic : function(){
        for (var key in logic.config.evas) {
            console.log("key : "+ key+" valor "+ logic.config.evas[key].getTempValue());
        }
    },
    showDicAll : function(){
        for (var key in logic.config.evas) {
            console.log("key : "+ key+" valor ",logic.config.evas[key]);
        }
    },
    draw: function(eva,id){
        var sons = eva.getSons();
        var value = eva.getValue();
        var checked = "checked";
        if ( !eva.getLocked() ){
            checked = "";
        }
        $("#"+id).append('<div id='+eva.getId()+'>'+eva.getName()+'<input type="text" value="'+value+
                        '"> ['+ eva.getBounds().lower+' , '+eva.getBounds().upper +' ]<input type="checkbox" class="simu" '+checked+'></div>');
        if (sons.length){
            for ( var  i=0; i < sons.length ; i++){
                logic.draw(sons[i],id);
            }
        }
    },
    simulation: function(eva){
        var sons = eva.getSons(),
            weights = 0,
            bounds = { lower:0, upper : 0 },
            minVal = { lower:21 , upper : 21 },
            minWeight=  { lower : 0 , upper : 0 },
            weightBound = { lower : 0 , upper : 0 } ;
        if ( sons.length == 0 && !eva.getLocked() ){
            return { lower: 0 , upper : 20 };
        }
        if ( sons.length == 0 ){
            return eva.getBounds();
        }
        no es necesario
        if ( sons.length > 0 ){
            for ( var i = 0 ; i < sons.length ; i++ ){
                var temp = logic.simulation( sons[i] ),
                    weight = sons[i].getWeight();
                bounds.lower += temp.lower* weight;
                bounds.upper += temp.upper* wei
                weights += weight;

                if ( temp.lower < minVal.lower ){
                    minVal.lower = temp.lower;
                    minWeight.lower = weight;
                }

                if ( temp.upper < minVal.upper ){
                    minVal.upper = temp.upper;
                    minWeight.upper = weight;
                }
            }
            weightBound.lower = weights;
            weightBound.upper = weights;
            if ( eva.shouldDeleteMinimum() ){
                bounds.lower -= minVal.lower;
                bounds.upper -= minVal.upper;
                weightBound.lower -= minWeight.lower;
                weightBound.upper -= minWeight.upper;
            }
            bounds.lower /= weightBound.lower;
            bounds.upper /= weightBound.upper;
            var precision = eva.getPrecision();
            bounds.lower = Math.floor( bounds.lower * precision ) / precision;
            bounds.upper = Math.floor( bounds.upper * precision ) / precision;
            eva.setBounds ( bounds );
            return bounds;
        }
    },
    execute : function( eva , testValue ){
        var sons = eva.getSons(),
            value = eva.getValue(),
            weights = 1;
            minValue = 21,
            minWeight = 0;

        if ( value == -1 && sons.length == 0){
            value = testValue;
        }
        if ( sons.length > 0 ){
            value = 0;
            weights = 0;
            for ( var i = 0 ; i < sons.length ; i++ ){
                var sonValue = logic.execute( sons[i], testValue ) * sons[i].getWeight();
                weights += sons[i].getWeight();
                //console.log(sonValue);
                value += sonValue;
                if ( sonValue < minValue){
                    minValue = sonValue;
                    minWeight = sons[i].getWeight();
                }
            }
            //console.log(value);
            if ( eva.getDeleteMin() ){

                value -= minValue;
                weights -= minWeight;
            }
        }
        value /= weights;
        value = Math.floor( value * eva.getPrecision()  ) / eva.getPrecision();
        //eva.setValue( value );
        eva.setTempValue(value);
        return value;
    },
    show : function( eva ) {
        var sons = eva.getSons();
        console.log("name : "+eva.getName()+" value : "+eva.getValue() );
        for (var i = 0; i < sons.length; i++) {
            logic.show( sons[i] );
        };
    }
};
$(document).ready(function () {
    logic.init();
});
