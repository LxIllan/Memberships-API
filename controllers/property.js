const PropertiesReader = require("properties-reader");
const { resolve } = require("path");
const fs = require("fs");
const logger = require('../config/logger');
const propertiesPath = resolve(__dirname + "/../config/memberships.properties");

/*
 * @desc    Get all properties
 * @route   GET /properties
 * @return  JSON object
*/
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
        jsonProperties["name"] = "S Memberships";
        jsonProperties["address"] = "404 Memberships St.";
        jsonProperties["phone"] = "000 000 0000";
        fs.closeSync(fs.openSync(propertiesPath, "w"));
        const properties = PropertiesReader(propertiesPath, { writer: { saveSections: true } });
        properties.set("name", jsonProperties["name"]);
        properties.set("address", jsonProperties["address"]);
        properties.set("phone", jsonProperties["phone"]);
        properties.save(propertiesPath, (err, data) => {
            if (err) {
                logger.warn(`Error writing a properties file. Method: ${req.method}, URL: ${req.url}.`);
                return res.status(500).json({ error: "Error writing a properties file." });
            }
        });
        logger.info(`Properties does not exist, they were created. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(200).json({ properties: jsonProperties });
    }
};

/*
 * @desc    Set/Create a property
 * @route   POST /properties
 * @return  JSON object
*/
exports.setProperty = (req, res) => {
    if (Object.keys(req.body).length === 0) {
        logger.warn(`No property was received. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: "Must send a property." });
    }
    const propertyName = Object.keys(req.body)[0];
    if (req.body[propertyName] === "") {
        logger.warn(`Property value is empty. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(400).json({ error: "Property value is empty." });
    }
    const properties = PropertiesReader(propertiesPath, { writer: { saveSections: true } });
    properties.set(propertyName, req.body[propertyName]);
    properties.save(propertiesPath, (err, data) => {
        if (err) {
            logger.warn(`Error saving a properties file. Method: ${req.method}, URL: ${req.url}.`);
            return res.status(500).json({ error: "Error saving a properties file." });
        }
        logger.info(`Property has been set. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(200).json({ property: req.body[propertyName] });
    });
};

/*
 * @desc    Get a property by name
 * @route   GET /properties/:name
 * @return  JSON object
*/
exports.getProperty = (req, res) => {
    const properties = PropertiesReader(propertiesPath);
    const property = properties.get(req.params.name);
    if (property === "") {
        logger.warn(`Property does not exist. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(404).json({ message: "Property does not exist." });
    }
    logger.info(`Get property. Method: ${req.method}, URL: ${req.url}.`);
    return res.status(200).json(property);
};

/*
 * @desc    Delete a property by name
 * @route   DELETE /properties/:name
 * @return  JSON object
*/
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
            return res.status(200).json({ message: "Property has been deleted." });
        });
    } else {
        logger.warn(`Property does not exist. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(200).json({ message: "Property does not exist." });
    }
};
