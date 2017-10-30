import React from 'React'
import { Image, View, AsyncStorage, ToastAndroid } from 'react-native';
import { SQLite } from 'expo';

import HomePage from './Home.page';
import ThisWeek from './components/thisWeek.component';

class Splash extends React.Component {
    render(){
        return (
            <View style={{flex: 1, backgroundColor: '#f49805', justifyContent: 'center', alignItems: 'center'}}>
                <Image source={require('./assets/bird_logo.png')} style={{height:46, width:57, tintColor: '#FFF'}} />
            </View>
        );
    }
}

export default class Main extends React.Component {
    constructor(props){
        super(props);

        this.db = SQLite.openDatabase({
            name: 'app.db',
        });
        this.state = {
            timeoutSplash: false,
            completeFetchStampTable: false,
            completeFetchRecordTable: false,
            completeFetchActiveCourse: false,
            completeFetchThisWeekRecord: false,
            completeFetchThisYearRecord: false,

            ownedStampList: [],
            recordList: [],
            courseNum: 0,

            thisWeekRecord: [],
            thisYearRecord: [],
        };

        this.sqLiteInitialize = this.sqLiteInitialize.bind(this);
        this.sqLiteInsertStamp = this.sqLiteInsertStamp.bind(this);
        this.sqLiteSelectStamp = this.sqLiteSelectStamp.bind(this);
        this.sqLiteInsertRecord = this.sqLiteInsertRecord.bind(this);
        this.sqLiteSelectRecord = this.sqLiteSelectRecord.bind(this);
        this.sqLiteSelectThisWeekRecord = this.sqLiteSelectThisWeekRecord.bind(this);
        this.sqLiteSelectThisYearRecord = this.sqLiteSelectThisYearRecord.bind(this);
        this.getActiveCourse = this.getActiveCourse.bind(this);
        this.setActiveCourse = this.setActiveCourse.bind(this);
    }
    componentWillMount(){
        this.sqLiteInitialize();
        this.getActiveCourse().then((x)=>{
            this.setState({
                completeFetchActiveCourse: true,
                courseNum: x
            });
        });
    }
    componentDidMount(){
        setTimeout(()=>{
            this.setState({
                timeoutSplash: true
            });
        }, 200);

        //this.sqLiteInsertStamp("stamp01.png");
    }

    sqLiteInitialize(){
        const queryCreateRecordTable =
            "CREATE TABLE IF NOT EXISTS record (idx INT PRIMARY KEY, course INT, week INT, distance FLOAT," +
            " time INT, reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)";
        const queryCreateStampTable =
            "CREATE TABLE IF NOT EXISTS stamp (idx INT PRIMARY KEY, name VARCHAR UNIQUE, reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)";

        this.db.transaction((tx)=> {
            //tx.executeSql("DROP TABLE record");
            //tx.executeSql("DROP TABLE stamp");

            tx.executeSql(queryCreateRecordTable, [], (tx)=>{
                this.sqLiteSelectRecord(tx, ()=>{
                    this.setState({
                        completeFetchRecordTable: true,
                        recordList: []
                    });
                });
            });
            tx.executeSql(queryCreateStampTable, [], (tx)=>{
                this.sqLiteSelectStamp(tx, (list)=>{
                    this.setState({
                        completeFetchStampTable: true,
                        ownedStampList: list
                    });
                });
            });
        });

        this.sqLiteSelectThisWeekRecord();
        this.sqLiteSelectThisYearRecord();
    }
    sqLiteSelectRecord(tx, callback){
        tx.executeSql("SELECT * FROM record WHERE 1", [], (tx, result)=>{
            let list = [];
            for(let i = 0; i < result.rows.length; i++){
                let item = result.rows.item(i);
                list.push(item);
            }

            if(callback) callback(list);
        });
    }

    async sqLiteSelectStamp(tx, callback){
        tx.executeSql("SELECT * FROM stamp WHERE 1", [], (tx, result)=>{
            let list = [];
            for(let i = 0; i < result.rows.length; i++){
                let item = result.rows.item(i);
                list.push(item);
            }

            if(callback) callback(list);
        });
    }

    async sqLiteSelectThisWeekRecord(){
        let thisWeek = ThisWeek();
        await this.db.transaction((tx)=> {
            tx.executeSql(
                "SELECT SUM(distance) as distance, SUM(time) as time" +
                " FROM record WHERE strftime('%Y', reg_date) = ? and week = ?" +
                " GROUP BY week", [new Date().getFullYear(), thisWeek], (tx, result)=>{
                this.setState({
                    thisWeekRecord: result.rows.item(0),
                    completeFetchThisWeekRecord: true
                });
            });
        });
    }

    async sqLiteSelectThisYearRecord(){
        await this.db.transaction((tx)=> {
            tx.executeSql(
                "SELECT SUM(distance) as distance, strftime('%m', reg_date)  as month" +
                " FROM record WHERE strftime('%Y', reg_date) = ?" +
                " GROUP BY strftime('%m', reg_date)" +
                " ORDER BY month ASC", [new Date().getFullYear()],
                (tx, result)=>{
                    let list = [];
                    let itemIndex = 0;
                    for(let i=0; i<12; i++){
                        if(itemIndex >= result.rows.length || result.rows.item(itemIndex).month != i + 1)
                            list.push(0);
                        else
                            list.push(result.rows.item(itemIndex++).distance);
                    }

                    this.setState({
                        thisYearRecord: list,
                        completeFetchThisYearRecord: true
                    });
                });
        });
    }

    async sqLiteInsertRecord(c, w, d, t){
        await this.db.transaction((tx)=> {
            tx.executeSql("INSERT INTO record (course, week, distance, time) VALUES (?, ?, ?, ?)", [c, w, d, t], (tx, result)=>{
                this.sqLiteSelectRecord(tx);
                this.sqLiteSelectThisWeekRecord();
                this.sqLiteSelectThisYearRecord();
            });
        });
    }
    async sqLiteInsertStamp(name){
        await this.db.transaction((tx)=> {
            tx.executeSql("INSERT INTO stamp (name) VALUES (?)", [name], (tx, result)=>{
                this.sqLiteSelectStamp(tx, (list)=>this.setState({ownedStampList: list}));
            });
        });
    }

    async getActiveCourse(){
        return parseInt(await AsyncStorage.getItem('active_course')) || 0;;
    }
    async setActiveCourse(num){
        await AsyncStorage.setItem('active_course', num.toString());
        ToastAndroid.show(num + '번 코스를 선택하셨습니다.', ToastAndroid.SHORT);
        this.setState({
            courseNum: num
        });
    }

    render(){
        const isShowSplash = !(
            this.state.timeoutSplash &&
            this.state.completeFetchStampTable &&
            this.state.completeFetchRecordTable &&
            this.state.completeFetchActiveCourse &&
            this.state.completeFetchThisWeekRecord &&
            this.state.completeFetchThisYearRecord
        );

        return (
            <View style={{flex: 1}}>
                {isShowSplash ?
                    <Splash />
                    :
                    <HomePage
                        stampList={this.state.ownedStampList}
                        recordList={this.state.recordList}
                        activeCourseNum={this.state.courseNum}
                        funcInsertStamp={this.sqLiteInsertStamp}
                        funcInsertRecord={this.sqLiteInsertRecord}
                        funcSetActiveCourse={this.setActiveCourse}
                        thisWeekRecord={this.state.thisWeekRecord}
                        thisYearRecord={this.state.thisYearRecord}
                    />
                }
            </View>
        );
    }
}
