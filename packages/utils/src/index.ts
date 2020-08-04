/**
 * Checks given value is either any of other values.
 * isEqualsEitherOf("today","today","is","a","good","day")
 * 
 * @param value value to be check
 * @param args values to be checked with.
 */
const isEqualsEitherOf = (value: any, ...args: any[]) => {
    for (let i = 0; i < args.length; i++) {
        if (value === args[i]) {
            return true;
        }
    }

    return false;
}

const getRandomNumber = (min: number, max?: number) => {
    const fallbackMin = 1;
    const _min = Number.isNaN(min) || min === 0 ? fallbackMin : Math.abs(min);
    let _max = Number.isNaN(Number(max)) ? min + 1 : Math.abs(Number(max));
    if (_max < _min) {
        _max = _min + 1;
    }
    const result = Math.floor(Math.random() * (_max - _min) + _min);
    return result;
}

export {
    isEqualsEitherOf,
    getRandomNumber
}