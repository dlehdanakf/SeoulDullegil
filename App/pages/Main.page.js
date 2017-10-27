import React from 'React'
import {
    Image, StyleSheet, Text, View
} from 'react-native';
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

            ownedStampList: [],
            recordList: [],
        };

        this.sqLiteInitialize = this.sqLiteInitialize.bind(this);
        this.sqLiteInsertStamp = this.sqLiteInsertStamp.bind(this);
        this.sqLiteSelectStamp = this.sqLiteSelectStamp.bind(this);
        this.sqLiteInsertRecord = this.sqLiteInsertRecord.bind(this);
        this.sqLiteSelectRecord = this.sqLiteSelectRecord.bind(this);
    }
    componentWillMount(){
        this.sqLiteInitialize();
    }
    componentDidMount(){
        setTimeout(()=>{
            this.setState({
                timeoutSplash: true
            });
        }, 500);
    }

    sqLiteInitialize(){
        const queryCreateRecordTable =
            "CREATE TABLE IF NOT EXISTS course (idx INT PRIMARY KEY, course INT, week INT, distance FLOAT," +
            " time INT, reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)";
        const queryCreateStampTable =
            "CREATE TABLE IF NOT EXISTS stamp (rnum INT UNIQUE, reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)";

        this.db.transaction((tx)=> {
            tx.executeSql(queryCreateRecordTable, [], (tx)=>{
                this.sqLiteSelectRecord(tx);
            });
            tx.executeSql(queryCreateStampTable, [], (tx)=>{
                this.sqLiteSelectStamp(tx);
            });
        });
    }
    sqLiteSelectRecord(tx){
        this.setState({
            completeFetchRecordTable: true,
            recordList: []
        });
    }
    sqLiteSelectStamp(tx){
        tx.executeSql("SELECT * FROM stamp WHERE 1", [], (tx, result)=>{
            let list = [];
            for(let i = 0; i < result.rows.length; i++){
                let item = result.rows.item(i);
                list.push(item);
            }

            this.setState({
                completeFetchStampTable: true,
                ownedStampList: list
            });
        });
    }
    sqLiteInsertRecord(){}
    sqLiteInsertStamp(){}

    render(){
        const isShowSplash = !(
            this.state.timeoutSplash &&
            this.state.completeFetchStampTable &&
            this.state.completeFetchRecordTable
        );

        return (
            <View style={{flex: 1}}>
                {isShowSplash ? <Splash /> : <HomePage /> }
            </View>
        );
    }
}