import database from '../config/db';
import returnResult from '../helper/result';

const productHelper = {
    initProductForm(res) {
        let productForm = { form: [], productcodeList: [] };
        let returnVal = [];
        let family = "";

        database.query('SELECT label, product_char_father_id, family_name FROM product_char1').then(char1 => {
            database.query('SELECT * FROM product_char2 order by product_char_father_id').then(char2 => {
                char1.forEach(element => {
                    let tempResult = { label: '', type: '', name: '', options: [], val: '' }; // labe, type, name, value, text
                    dropdownStart = false;
                    tempResult['label'] = element.Label;
                    char2.forEach(element2 => {
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
                            productForm.productcodeList.push(productcodeList[key]['product_code'])
                        })

                        productForm.form = returnVal;
                        returnResult(res, 'Product add form', 0, productForm);
                    })
                    .catch(err => returnResult(res, 'Oops, error in getting product form', 1, err));
            });
        });
    },


    initByProductCode(productbody, res) {
        let productForm = { form: [], productcodeList: [] };
        let returnVal = [];
        let family = "";

        database.query('SELECT label, product_char_father_id, family_name FROM product_char1').then(char1 => {
            database.query('SELECT * FROM product_char2 order by product_char_father_id').then(char2 => {
                char1.forEach(element => {
                    let productbodyItem = productbody.filter(function (item) {
                        return item.product_char_father_id == element.product_char_father_id
                    });

                    let tempResult = { label: '', type: '', name: '', options: [], val: 0 }; // labe, type, name, value, text
                    dropdownStart = false;
                    tempResult['label'] = element.Label;

                    char2.forEach(element2 => {
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
                            productForm.productcodeList.push(productcodeList[key]['product_code'])
                        });

                        productForm.form = returnVal;
                        returnResult(res, 'Product add form for code', 0, productForm);
                    })
                    .catch(err => returnResult(res, 'Oops, error in getting product form by code', 1, err));
            });
        });
    },


    addProduct(req, res) {
        let formdata = req.body.raw;
        let productCode = formdata['ProductCode'];
        let family = 'NOFAMILY';
        let noformfields = ["ProductCode", "Family"];

        database.query('INSERT INTO product_head(product_code, family_name) VALUES(?,?)', [productCode, family])
            .then(result => {
                let productHeaderId = result.insertId;
                let finalProductCode = "";

                Object.keys(formdata).forEach(key => {
                    let fieldName = key;
                    let optionValue;
                    if (noformfields.indexOf(fieldName) < 0) {
                        let filedNameArray = fieldName.split("-");
                        if (filedNameArray[1] == "select")
                            optionValue = formdata[key].split("_");

                        let productCharChildId = filedNameArray[1] == "select" ? optionValue[0] : 0;
                        let val = formdata[key] == '' ? 0 : formdata[key];
                        let productCharChildValue = filedNameArray[1] == "select" ? 0 : val;

                        finalProductCode += (filedNameArray[1] == "select" && val != 0 && optionValue[1] != "NOFAMILY") ? optionValue[1] : "";
                        finalProductCode += (filedNameArray[1] != "select" && val != '' && filedNameArray[3] != "NOFAMILY") ? filedNameArray[3] : "";

                        database.query('INSERT INTO product_body(product_header_id, product_char_father_id, product_char_child_id, product_char_child_value) VALUES(?,?,?,?)',
                            [productHeaderId, filedNameArray[2], productCharChildId, productCharChildValue])
                            .then(() => { /* console.log('productbody data is saved') */ })
                            .catch(err => returnResult(res, 'Oops, adding product body error!', 1, err));
                    }
                });

                database.query('UPDATE product_head SET family_name=? WHERE id=?', [finalProductCode, productHeaderId])
                    .then(result => returnResult(res, 'Saved successfully!', 0, result))
                    .catch(err => returnResult(res, 'Oops, updating product head error!', 1, err));
            })
            .catch(err => returnResult(res, 'Oops, adding product head error!', 1, err));
    },


    updateProduct(productHeaderId, req, res) {
        let formdata = req.body.raw;
        let productCode = formdata['ProductCode'];
        let family = 'NOFAMILY';
        let noformfields = ["ProductCode", "Family"];

        database.query('UPDATE product_head SET family_name=? WHERE product_code=?', [family, productCode])
            .then(() => {
                // delete origin productbody record
                database.query('DELETE FROM product_body WHERE product_header_id=?', [productHeaderId])
                    .then(() => {
                        let finalProductCode = "";

                        Object.keys(formdata).forEach(key => {
                            let fieldName = key;
                            let optionValue;
                            if (noformfields.indexOf(fieldName) < 0) {
                                let filedNameArray = fieldName.split("-");
                                if (filedNameArray[1] == "select")
                                    optionValue = formdata[key].split("_");

                                let productCharChildId = filedNameArray[1] == "select" ? optionValue[0] : 0;
                                let val = formdata[key] == '' ? 0 : formdata[key];
                                let productCharChildValue = filedNameArray[1] == "select" ? 0 : val;

                                finalProductCode += (filedNameArray[1] == "select" && val != 0 && optionValue[1] != "NOFAMILY") ? optionValue[1] : "";
                                finalProductCode += (filedNameArray[1] != "select" && val != '' && filedNameArray[3] != "NOFAMILY") ? filedNameArray[3] : "";

                                database.query('INSERT INTO product_body(product_header_id, product_char_father_id, product_char_child_id, product_char_child_value) VALUES(?,?,?,?)',
                                    [productHeaderId, filedNameArray[2], productCharChildId, productCharChildValue])
                                    .then(() => {/* console.log('productbody data is updated'); */ })
                                    .catch(err => returnResult(res, 'Oops, error occured in recording product body!', 1, err));
                            }
                        });

                        database.query('UPDATE product_head SET family_name=? WHERE id=?', [finalProductCode, productHeaderId])
                            .then(result => returnResult(res, 'Updated successfully!', 0, result))
                            .catch(err => returnResult(res, 'Oops, error occured in updating product head secondly!', 1, err));
                    })
                    .catch(err => returnResult(res, 'Oops, error occured in deleting product body!', 1, err));
            })
            .catch(err => returnResult(res, 'Oops, error occured in updating product head first!', 1, err));
    }
}

export default productHelper;