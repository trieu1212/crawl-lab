const cors = require('cors');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
let product_id = []
const outputPath = 'data.json'
const getProductId = async ({ url }) => {
    const res = await fetch(url)
    const data = await res.json()
    for (let i = 0; i < data.data.length; i++) {
        product_id.push(data.data[i].id)
    }
}
const getProductInfo = async ({ id }) => {
    const res = await fetch(`https://tiki.vn/api/v2/products/${id}?platform=web&spid=273947994&version=3`)
    const data = await res.json()
    const jsonData = {
        id: data.id,
        name: data.name,
        sku: data.sku,
        short_description: data.short_description,
        list_price: data.list_price,
        discount: data.discount,
        discount_rate: data.discount_rate,
        review_count: data.review_count,
        inventory_status: data.inventory_status,
        stock_item_qty: data.stock_item.qty,
        stock_item_max_sale_qty: data.stock_item.max_sale_qty,
        brand: data.brand.name,
    };
    return jsonData;
}
const main = async () => {
    for (let i = 1; i < 3; i++) {
        await getProductId({
            url: `https://tiki.vn/api/personalish/v1/blocks/listings?limit=40&include=advertisement&aggregations=2&version=home-persionalized&trackity_id=64d4deeb-4834-21f8-f8c3-0e9b8ac4215a&category=1795&page=${i}&urlKey=dien-thoai-smartphone`
        })
    }
    let jsonData = []
    for (let i = 0; i < product_id.length; i++) {
        jsonData.push(await getProductInfo({
            id: product_id[i]
        }))
    }
    const jsonFile = JSON.stringify(jsonData, null, 2)
    fs.writeFile(outputPath, jsonFile, 'utf8', (err) => {
        if (err) {
            console.error('Error writing JSON file:', err);
        } else {
            console.log('JSON file has been saved successfully.');
        }
    });
    const csvWriter = createObjectCsvWriter({
        path: 'data.csv',
        header: [
            { id: 'id', title: 'ID' },
            { id: 'name', title: 'Name' },
            { id: 'sku', title: 'SKU' },
            { id: 'short_description', title: 'Short Description' },
            { id: 'list_price', title: 'List Price' },
            { id: 'discount', title: 'Discount' },
            { id: 'discount_rate', title: 'Discount Rate' },
            { id: 'review_count', title: 'Review Count' },
            { id: 'inventory_status', title: 'Inventory Status' },
            { id: 'stock_item_qty', title: 'Stock Item Qty' },
            { id: 'stock_item_max_sale_qty', title: 'Stock Item Max Sale Qty' },
            { id: 'brand', title: 'Brand' },
        ]
    })
    csvWriter
        .writeRecords(jsonData)
        .then(() => console.log('The CSV file was written successfully'));
}
main()


