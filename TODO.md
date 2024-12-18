These changes are not ordered by priority or expected time consumption.

CONTROLS:
-   Convert the displayed section numbering from zero-indexed to one-indexed.
✔   Add columns to section
✔   Add all column types to columns select
✔   Delete columns
-   Sort types by drag n drop.
-   Sort sections by drag n drop.
-   Delete sections.
-   Add sections.
-   Match edit configuration to configuration changes.
-   Prevent global config change from being saved when there are unsaved changes
    and the widths are resized.
-   Fix tab content block width. It should not resize for the content of different tabs.
-   Fix keys so that checkmark will toggle display in header and in columns.
    It currently only affects column display.
-   Rework multi-day sections to be more elegant in handling of columns
-   When row type selection changes, update the section form to include appropriate fields.
    (Especially for multi-day/single-day.)
✔   Add functionality to change row height.
GLOBAL:
-   Match display toggle for types in header keys and columns.
-   Update schedule dynamically when configuration is updated.
-       Update header
-       Update meetings listing
-       Load new meetings if source URL changes. (Might as well reload page.)
-   Add fallback to local data (for meetings, etc) when Internet is down.
