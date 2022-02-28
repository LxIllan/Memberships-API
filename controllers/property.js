const PropertiesReader = require('properties-reader');
const {resolve} = require('path')
const propertiesPath = resolve(__dirname + '/../config/memberships.properties')
const fs = require('fs');

exports.getProperties = (req, res) => {
    try {
        const properties = PropertiesReader(propertiesPath)
        const allProperties = properties.getAllProperties()
        Object.keys(allProperties).forEach((k) => allProperties[k] === '' && delete allProperties[k])
        console.log(allProperties)
        return res.status(200).json({properties : allProperties})
    } catch (err) {
        const jsonProperties = {};
        jsonProperties["name"] = "Memberships";
        jsonProperties["address"] = "404 Memberships St";
        jsonProperties["phone"] = "000 000 0000";
        fs.closeSync(fs.openSync(propertiesPath, 'w'))
        const properties = PropertiesReader(propertiesPath, { writer: { saveSections: true } })
        properties.set("name", "Memberships")
        properties.set("address", "404 Memberships St")
        properties.set("phone", "000 000 0000")
        properties.save(propertiesPath, (err, data) => {
            if (err) {
                return res.status(500).json({error: "Error writing a properties file."})
            }
        })
        return res.status(200).json({properties:jsonProperties});
    }

}

exports.setProperty = (req, res) => {
    const propertyName = Object.keys(req.body)[0];
    const properties = PropertiesReader(propertiesPath, { writer: { saveSections: true } })
    properties.set(propertyName, req.body[propertyName])
    properties.save(propertiesPath, (err, data) => {
        if (err) {
            return res.status(500).json({error: err});
        }
        res.status(200).json({ property : req.body[propertyName]})
    })
}

exports.getProperty = (req, res) => {
    const properties = PropertiesReader(propertiesPath)
    const property = properties.get(req.params.name)
    res.status(200).json(property)
}

exports.deleteProperty = (req, res) => {
    console.log(req.params)
    const properties = PropertiesReader(propertiesPath, { writer: { saveSections: true } })
    properties.set(req.params.name, '')
    properties.save(propertiesPath, (err, data) => {
        if (err) {
            return res.status(500).json({error: err});
        }
        res.status(200).json({ message : "Property has been deleted." })
    })
}