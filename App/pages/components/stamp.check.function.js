export default function(rnum, list){
    for(let i = 0; i < list.length; i++){
        if(list[i].rnum === rnum.toString()){
            return list[i].reg_date;
        }
    }

    return null;
}