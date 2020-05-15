var dom = document.getElementById('main');
var myChart = echarts.init(dom);
myChart.showLoading();

$.get('geojs-24-mun.json', function (rnJson) {
    myChart.hideLoading()

    echarts.registerMap('RN', rnJson, {
    });

    /*var myLayer = L.geoJSON().addTo('RN');
    myLayer.addData(rnJson);*/

    $.get('13052020.csv', function (data){
        var lines = data.split('\n');

        var result = [];
        for (var i = 0; i < lines.length; ++i) {
            var columns = lines[i].split(',');
            for (var j = 1; j < columns.length; ++j) {
                var value = {
                    name: columns[0],
                    value: columns[j]
                };

                var id = j - 1;
                if (result[id]) {
                    result[id].push(value);
                }
                else {
                    result[id] = [value];
                }
            }
        }
        var options = result.map(function(day){
            return{
                series:{
                    data: day
                }
            }
        })
        //console.log(lines[0].split(',').slice(4));
        myChart.setOption({
            timeline:{
                data: lines[0].split(',').slice(1),
                axisType: 'category',
                autoplay:true,
                playInterval:200,
                symbolSize:4,
                tooltip:{
                    formatter: function (params){
                        return params.name;
                    }
                },
                itemStyle:{
                    color:'dimgrey'
                },
                lineStyle:{
                    color: 'palegoldenrod'
                },
                label:{
                    color: '#777'
                },
                checkpointStyle:{
                    color: 'firebrick'
                }
            },
            options:options
        })
    });

    myChart.setOption({
        baseOption:{
            title: {
                text: 'Casos Ativos - Covid-19 - RN (2020)',
                subtext: 'Fonte: Ministério da Saúde/IBGE',
                sublink: 'http://covid.saude.gov.br',
                left: 'right'
            },
            tooltip: {
                trigger: 'item',
                showDelay: 0,
                transitionDuration: 0.2,
                formatter: function (params) {
                    var value = (params.value + '').split('.');
                    value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
                    return params.seriesName + '<br/>' + params.name + ': ' + (isNaN(parseInt(value)) ? 0 : value) ;
                }
            },
            /*tooltip:{
                trigger: 'item',
                showDelay: 0,
                transitionDuration: 0.2,
                show: true,
                formatter: function (params){
                    return params.value[0] + ':' + params.value[1];
                }
            },*/
            visualMap: {
                left: 'right',
                min: 0,
                max: 1033,
                range:[1,1033],
                inRange: {
                    color: ['yellow','orange', 'orange','red', 'red'],
                    opacity: [0.2,0.6,0.8,0.9,1],
                },
                borderColor:{
                    color:'#FFF',
                    opacity:1
                },
                text: ['1033', '1'],
                calculable: false,
                outOfRange:{
                    opacity:0,
                },
            },
            toolbox: {
                show: false,
                orient: 'vertical',
                left: 'left',
                top: 'top',
                feature: {
                    dataView: {readOnly: false},
                    restore: {},
                    saveAsImage: {
                        name:'Salvar como Imagem'
                    }
                }
            },
            series:[{
                roam: true,
                name: 'Casos Ativos',
                type: 'map',
                aspectScale: 0.99,
                zoom:1,
                map: 'RN',
                itemStyle:{
                    opacity:0.8,
                    borderColor:{
                        color:'#FFF',
                        opacity:1
                    },
                    borderType:'solid'
                },
                emphasis: {
                    opacity:8,
                    label: {
                        show: false
                    }
                },
                data:[]
            }],
            /*leaflet:{
                center:[-36.5021951898, -6.0981589432],
                zoomControl: false,
                zoom:8,
                roam: false,
                itemStyle:{
                    opacity: 1
                },
                tiles: [{
                    label: 'OpenStreetMap',
                    urlTemplate: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
                    options: {
                        attribution: '<a href="https://maps.wikimedia.org" target="_blank">Wikimedia Commons</a>'
                    }
                }]
            } */
        }
    });
});

window.onresize = function(){
    myChart.resize({
        width: dom.clientWidht,
        height: dom.clientHeight,
    })
}
