document.addEventListener('DOMContentLoaded', function(){
    let chart = bb.generate({
        data: {
            x: 'months',
            columns: [
                [
                    "data1",
                    0, 0, 0, 0,
                    0, 0, 0, 0,
                    0, 0, 0, 0
                ],
                [
                    'months',
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
                ]
            ],
            axes: {
                data1: "y",
            },
            colors: {
                data1: '#f49805'
            },
        },
        point: {
            show: false
        },
        axis: {
            y: {
                label: 'km'
            }
        },
        size: {
            height: 140,
            width: window.innerWidth
        },
        grid: {
            x: {
                lines: [
                    {
                        value: 3,
                        text: '1분기'
                    },
                    {
                        value: 6,
                        text: '2분기'
                    },
                    {
                        value: 9,
                        text: '3분기'
                    },
                    {
                        value: 12,
                        text: '4분기'
                    }
                ]
            }
        },
        padding: {
            right: 20
        },
        bar: {
            "width": {
                "ratio": 0.5
            }
        },
        legend: {
            show: false
        },
        bindto: "#graph"
    });

    window.RNMessagesChannel.on('setGraphData', function(e){
        let c = ['data1'];
        c = c.concat(e);

        chart.load({
            columns: [c]
        });
    });
});