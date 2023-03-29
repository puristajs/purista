ATTACH MATERIALIZED VIEW _ UUID 'acf5bb09-36b1-4237-80c6-d8ad1132a0eb' TO signoz_logs.logs_attribute_keys
(
    `name` String,
    `datatype` String
) AS
SELECT DISTINCT
    arrayJoin(attributes_int64_key) AS name,
    'Int64' AS datatype
FROM signoz_logs.logs
ORDER BY name ASC
