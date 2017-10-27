import React from 'React'
import { Image, View, AsyncStorage } from 'react-native';
import { SQLite } from 'expo';

import HomePage from './Home.page';

class Splash extends React.Component {
    render(){
        return (
            <View style={{flex: 1, backgroundColor: '#f49805', justifyContent: 'center', alignItems: 'center'}}>
                <Image source={require('./assets/bird_logo.png')} style={{height:50, width:62, tintColor: '#FFF'}} />
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

            ownedStampList: [],
            recordList: [],
            courseNum: 0,
        };

        this.sqLiteInitialize = this.sqLiteInitialize.bind(this);
        this.sqLiteInsertStamp = this.sqLiteInsertStamp.bind(this);
        this.sqLiteSelectStamp = this.sqLiteSelectStamp.bind(this);
        this.sqLiteInsertRecord = this.sqLiteInsertRecord.bind(this);
        this.sqLiteSelectRecord = this.sqLiteSelectRecord.bind(this);
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
    }

    sqLiteInitialize(){
        const queryCreateRecordTable =
            "CREATE TABLE IF NOT EXISTS record (idx INT PRIMARY KEY, course INT, week INT, distance FLOAT," +
            " time INT, reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)";
        const queryCreateStampTable =
            "CREATE TABLE IF NOT EXISTS stamp (idx INT PRIMARY KEY, rnum INT UNIQUE, reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)";

        this.db.transaction((tx)=> {
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
    }
    sqLiteSelectRecord(tx, callback){
        callback();
    }
    sqLiteSelectStamp(tx, callback){
        tx.executeSql("SELECT * FROM stamp WHERE 1", [], (tx, result)=>{
            let list = [];
            for(let i = 0; i < result.rows.length; i++){
                let item = result.rows.item(i);
                list.push(item);
            }

            callback(list);
        });
    }
    async sqLiteInsertRecord(c, w, d, t){
        await this.db.transaction((tx)=> {
            tx.executeSql("INSERT INTO record (course, week, distance, time) VALUE (?, ?, ?, ?)", [c, w, d, t]);
        });
    }
    async sqLiteInsertStamp(rnum){
        await this.db.transaction((tx)=> {
            tx.executeSql("INSERT INTO record (rnum) VALUE (?)", [rnum], (tx, result)=>{
                this.sqLiteSelectStamp(tx);
            });
        });
    }
    async getActiveCourse(){ return parseInt(await AsyncStorage.getItem('active_course')) || 0 }
    async setActiveCourse(num){ await AsyncStorage.setItem('active_course', num); }

    render(){
        const isShowSplash = !(
            this.state.timeoutSplash &&
            this.state.completeFetchStampTable &&
            this.state.completeFetchRecordTable &&
            this.state.completeFetchActiveCourse
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
                    />
                }
            </View>
        );
    }
}