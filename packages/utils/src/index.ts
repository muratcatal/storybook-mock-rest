/**
 * Checks given value is either any of other values.
 * isEqualsEitherOf("today","today","is","a","good","day")
 * 
 * @param value value to be check
 * @param args values to be checked with.
 */
const isEqualsEitherOf = (value: any,...args: any[]) => {
    for(let i = 0; i < args.length;i++){
        if(value === args[i]){
            return true;
        }
    }

    return false;
}

export {
    isEqualsEitherOf
}