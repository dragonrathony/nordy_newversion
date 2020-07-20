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
    },


    addProduct(req, res) {
        let formdata = req.body.raw;
        let ProductCode = formdata['ProductCode'];
        let family = 'NOFAMILY';
        let noformfields = ["ProductCode", "Family"];
        // res.json({ message: 'addded successfully!', error: 0, result: ProductCode })
        database.query('INSERT INTO product_head(product_code, family_name) VALUES(?,?)', [ProductCode, family])
            .then(result => {
                // console.log('producthead is inserted', result)
                let ProductHeaderID = result.insertId;
                let Finalproductcode = "";

                Object.keys(formdata).forEach(key => {
                    let fieldName = key;
                    let optionvalue;
                    if (noformfields.indexOf(fieldName) < 0) {
                        let filedNameArray = fieldName.split("-");
                        if (filedNameArray[1] == "select")
                            optionvalue = formdata[key].split("_");

                        let ProductCharChildId = filedNameArray[1] == "select" ? optionvalue[0] : 0;
                        let val = formdata[key] == '' ? 0 : formdata[key];
                        let ProductCharChildValue = filedNameArray[1] == "select" ? 0 : val;

                        Finalproductcode += (filedNameArray[1] == "select" && val != 0 && optionvalue[1] != "NOFAMILY") ? optionvalue[1] : "";
                        Finalproductcode += (filedNameArray[1] != "select" && val != '' && filedNameArray[3] != "NOFAMILY") ? filedNameArray[3] : "";

                        database.query('INSERT INTO product_body(product_header_id, product_char_father_id, product_char_child_id, product_char_child_value) VALUES(?,?,?,?)',
                            [ProductHeaderID, filedNameArray[2], ProductCharChildId, ProductCharChildValue])
                            .then(result => {
                                console.log('productbody data is saved', result)
                            })
                            .catch(err => res.json({ message: 'Oops, error occured11!', error: 1, result: err }));
                    }
                });

                database.query('UPDATE product_head SET family_name=? WHERE id=?', [Finalproductcode, ProductHeaderID])
                    .then(result => {
                        res.json({ message: 'Saved successfully!', error: 0, result: result });
                    })
                    .catch(err => res.json({ message: 'Oops, error occured22!', error: 1, result: err }));
            })
            .catch(err => {
                console.log('error33', err)
                res.json({ message: 'Oops, error occured33!', error: 1, result: err })
            });
    },


    updateProduct(ProductHeaderID, req, res) {
        let formdata = req.body.raw;
        let ProductCode = formdata['ProductCode'];
        let family = 'NOFAMILY';
        let noformfields = ["ProductCode", "Family"];
        // res.json({ message: 'update  successfully!', error: 0, result: ProductCode })
        database.query('UPDATE product_head SET family_name=? WHERE product_code=?', [family, ProductCode])
            .then(result => {
                // delete origin productbody record
                database.query('DELETE FROM product_body WHERE product_header_id=?', [ProductHeaderID])
                    .then(result => {
                        // console.log('Deleted product body record successfully');
                        let Finalproductcode = "";

                        Object.keys(formdata).forEach(key => {
                            let fieldName = key;
                            let optionvalue;
                            if (noformfields.indexOf(fieldName) < 0) {
                                let filedNameArray = fieldName.split("-");
                                if (filedNameArray[1] == "select")
                                    optionvalue = formdata[key].split("_");

                                let ProductCharChildId = filedNameArray[1] == "select" ? optionvalue[0] : 0;
                                let val = formdata[key] == '' ? 0 : formdata[key];
                                let ProductCharChildValue = filedNameArray[1] == "select" ? 0 : val;

                                Finalproductcode += (filedNameArray[1] == "select" && val != 0 && optionvalue[1] != "NOFAMILY") ? optionvalue[1] : "";
                                Finalproductcode += (filedNameArray[1] != "select" && val != '' && filedNameArray[3] != "NOFAMILY") ? filedNameArray[3] : "";

                                database.query('INSERT INTO product_body(product_header_id, product_char_father_id, product_char_child_id, product_char_child_value) VALUES(?,?,?,?)',
                                    [ProductHeaderID, filedNameArray[2], ProductCharChildId, ProductCharChildValue])
                                    .then(result => {
                                        // console.log('productbody data is updated', result)
                                    })
                                    .catch(err => res.json({ message: 'Oops, error occured!', error: 1, result: err }));
                            }
                        });

                        database.query('UPDATE product_head SET family_name=? WHERE Id=?', [Finalproductcode, ProductHeaderID])
                            .then(result => {
                                res.json({ message: 'Updated successfully!', error: 0, result: result });
                            })
                            .catch(err => res.json({ message: 'Oops, error occured!', error: 1, result: err }));
                    })
                    .catch(err => {
                        console.log('productbody delete error');
                    });
            })
            .catch(err => res.json({ message: 'Oops, error occured!', error: 1, result: err }));
    }
}

export default productHelper;