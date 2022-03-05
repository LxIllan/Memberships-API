const PropertiesReader = require("properties-reader");
const { resolve } = require("path");
const fs = require("fs");
const logger = require('../config/logger');
const propertiesPath = resolve(__dirname + "/../config/memberships.properties");

exports.getProperties = (req, res) => {
    try {
        const properties = PropertiesReader(propertiesPath);
        const allProperties = properties.getAllProperties();
        Object.keys(allProperties).forEach(
            (k) => allProperties[k] === "" && delete allProperties[k]
        );
        logger.warn(`Get properties. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(200).json({ properties: allProperties });
    } catch (err) {
        const jsonProperties = {};
        jsonProperties["name"] = "Memberships";
        jsonProperties["address"] = "404 Memberships St";
        jsonProperties["phone"] = "000 000 0000";
        fs.closeSync(fs.openSync(propertiesPath, "w"));
        const properties = PropertiesReader(propertiesPath, { writer: { saveSections: true } });
        properties.set("name", "Memberships");
        properties.set("address", "404 Memberships St");
        properties.set("phone", "000 000 0000");
        properties.save(propertiesPath, (err, data) => {
            if (err) {
                logger.warn(`Error writing a properties file. Method: ${req.method}, URL: ${req.url}.`);
                return res.status(500).json({ error: "Error writing a properties file." });
            }
        });
        logger.info(`Properties does not exist, they were created. Method: ${req.method}, URL: ${req.url}.`);
        res.status(200).json({ properties: jsonProperties });
    }
};

exports.setProperty = (req, res) => {
    if (Object.keys(req.body).length === 0) {
        logger.warn(`No property was received. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: "Must send a property." });
    }
    const propertyName = Object.keys(req.body)[0];
    const properties = PropertiesReader(propertiesPath, { writer: { saveSections: true } });
    properties.set(propertyName, req.body[propertyName]);
    properties.save(propertiesPath, (err, data) => {
        if (err) {
            logger.warn(`Error saving a properties file. Method: ${req.method}, URL: ${req.url}.`);
            return res.status(500).json({ error: "Error saving a properties file." });
        }
        logger.info(`Property has been set. Method: ${req.method}, URL: ${req.url}.`);
        res.status(200).json({ property: req.body[propertyName] });
    });
};

exports.getProperty = (req, res) => {
    const properties = PropertiesReader(propertiesPath);
    const property = properties.get(req.params.name);
    logger.info(`Get property. Method: ${req.method}, URL: ${req.url}.`);
    res.status(200).json(property);
};

exports.deleteProperty = (req, res) => {
    if (Object.keys(req.params).length === 0) {
        logger.warn(`No property was received. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: "Must send a property." });
    }
    
    const properties = PropertiesReader(propertiesPath, { writer: { saveSections: true } });    
    const allProperties = properties.getAllProperties();
    
    if (req.params.name in allProperties) {
        properties.set(req.params.name, "");
        properties.save(propertiesPath, (err, data) => {
            if (err) {
                logger.warn(`Error saving a properties file. Method: ${req.method}, URL: ${req.url}.`);
                return res.status(500).json({ error: "Error saving a properties file." });
            }
            logger.info(`Property has been deleted. Method: ${req.method}, URL: ${req.url}.`);
            res.status(200).json({ message: "Property has been deleted." });
        });
    } else {
        logger.warn(`Property does not exist. Method: ${req.method}, URL: ${req.url}.`);
        res.status(200).json({ message: "Property does not exist." });
    }
};
