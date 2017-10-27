export default function(name, list){
    for(let i = 0; i < list.length; i++){
        if(list[i].name.toString() === name.toString()){
            return list[i].reg_date;
        }
    }

    return null;
}