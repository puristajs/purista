ATTACH MATERIALIZED VIEW _ UUID 'd1ce1b69-98d4-4540-b016-b1e7b9c28d6c' TO signoz_logs.logs_resource_keys
(
    `name` String,
    `datatype` String
) AS
SELECT DISTINCT
    arrayJoin(resources_string_key) AS name,
    'String' AS datatype
FROM signoz_logs.logs
ORDER BY name ASC
