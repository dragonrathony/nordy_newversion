import database from '../config/db';

const productHelper = {
    initProductForm(res) {
        let returnResult = { form: [], productcodeList: [] };
        let returnVal = [];
        var family = "";
        database.query('SELECT label, product_char_father_id, family_name FROM product_char1').then(result => {
            database.query('SELECT * FROM product_char2 order by product_char_father_id').then(result2 => {
                result.forEach(element => {
                    let tempResult = { label: '', type: '', name: '', options: [], val: '' }; // labe, type, name, value, text
                    dropdownStart = false;
                    tempResult['label'] = element.Label;
                    result2.forEach(element2 => {
                        if (element.product_char_father_id == element2.product_char_father_id) {
                            if (element.family_name == 1) {
                                family = element2.product_chilc_nick_name;
                            } else {
                                family = 'NOFAMILY';
                            }
                            if (element2.ProductChildId == 0) {
                                tempResult['type'] = 'input';
                                tempResult['name'] = `ProductCharFatherId-input-${element.product_char_father_id}-${family}`
                            } else {
                                if (!dropdownStart) {
                                    selectOption = {};
                                    tempResult['type'] = 'select';
                                    tempResult['name'] = `ProductCharFatherId-select-${element.product_char_father_id}`
                                    selectOption['text'] = '--Select--';
                                    selectOption['value'] = 0;
                                    tempResult['options'].push(selectOption);
                                    dropdownStart = true;
                                }
                                selectOption = {};
                                let tempValue = `${element2.product_child_id}_${family}`;
                                let tempText = element2.product_child_desc;
                                selectOption['text'] = tempText;
                                selectOption['value'] = tempValue;
                                tempResult['options'].push(selectOption);
                            }
                        }
                    });
                    returnVal.push(tempResult)
                });

                // Get productcode list
                database.query("SELECT DISTINCT product_code FROM product_head")
                    .then(productcodeList => {
                        Object.keys(productcodeList).forEach(key => {
                            returnResult.productcodeList.push(productcodeList[key]['product_code'])
                        })

                        returnResult.form = returnVal;
                        console.log('return result', returnResult)
                        res.json(returnResult);
                    })
                    .catch(err => {
                        console.log('productcode list getting error', err)
                    });
            });
        });
    },


    initByProductCode(productbody, res) {
        let returnResult = { form: [], productcodeList: [] };
        let returnVal = [];
        var family = "";
        database.query('SELECT label, product_char_father_id, family_name FROM product_char1').then(result => {
            database.query('SELECT * FROM product_char2 order by product_char_father_id').then(result2 => {
                result.forEach(element => {
                    let productbodyItem = productbody.filter(function (item) {
                        return item.product_char_father_id == element.product_char_father_id
                    });

                    let tempResult = { label: '', type: '', name: '', options: [], val: 0 }; // labe, type, name, value, text
                    dropdownStart = false;
                    tempResult['label'] = element.Label;

                    result2.forEach(element2 => {
                        if (element.product_char_father_id == element2.product_char_father_id) {
                            if (element.family_name == 1) {
                                family = element2.product_child_nick_name;
                            } else {
                                family = 'NOFAMILY';
                            }
                            if (element2.product_child_id == 0) {
                                tempResult['type'] = 'input';
                                tempResult['name'] = `ProductCharFatherId-input-${element.product_char_father_id}-${family}`
                                tempResult['val'] = productbodyItem[0].product_char_child_value; // saved value
                            } else {
                                if (!dropdownStart) {
                                    selectOption = {};
                                    tempResult['type'] = 'select';
                                    tempResult['name'] = `ProductCharFatherId-select-${element.product_char_father_id}`
                                    selectOption['text'] = '--Select--';
                                    selectOption['value'] = 0;
                                    tempResult['options'].push(selectOption);
                                    dropdownStart = true;
                                }
                                selectOption = {};
                                let tempValue = `${element2.product_child_id}_${family}`;
                                let tempText = element2.product_child_desc;
                                selectOption['text'] = tempText;
                                selectOption['value'] = tempValue;
                                tempResult['options'].push(selectOption);
                            }
                        }
                    });
                    if (tempResult.type == 'select') {
                        let optionVal = productbodyItem[0].product_child_id; // saved value
                        let defaultVal = tempResult.options[optionVal].value;
                        tempResult.val = defaultVal;
                    }
                    returnVal.push(tempResult);
                });

                // Get productcode list
                database.query("SELECT DISTINCT product_code FROM product_head")
                    .then(productcodeList => {
                        Object.keys(productcodeList).forEach(key => {
                            returnResult.productcodeList.push(productcodeList[key]['product_code'])
                        });

                        returnResult.form = returnVal;
                        res.json(returnResult);
                    })
                    .catch(err => {
                        console.log('productcode list getting error', err)
                    });
            });
        });
    }
}

export default productHelper;