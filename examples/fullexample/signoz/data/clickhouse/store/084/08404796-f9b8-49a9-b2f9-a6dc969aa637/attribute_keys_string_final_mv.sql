ATTACH MATERIALIZED VIEW _ UUID '107dbe9f-43c1-4d7e-a049-c815b5eeee1b' TO signoz_logs.logs_attribute_keys
(
    `name` String,
    `datatype` String
) AS
SELECT DISTINCT
    arrayJoin(attributes_string_key) AS name,
    'String' AS datatype
FROM signoz_logs.logs
ORDER BY name ASC
