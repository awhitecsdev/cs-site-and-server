"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const PAPA_PARSE_CDN =
        "https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js";

    const ROW_ID = Symbol("rowId");


    // ============================================================
    // APPLICATION STATE
    // ============================================================

    const state = {

        fileName: "",

        records: [],

        columns: [],

        numericColumns: new Set(),

        query: "",

        searchField: "__all__",

        profileField: null,

        sortColumn: null,

        sortDirection: "asc",

        page: 1,

        pageSize: 50,

        editingId: null
    };


    // ============================================================
    // HTML ELEMENTS
    // ============================================================

    const elementIds = {

        uploadSection: "uploadSection",

        workspace: "workspace",

        fileInput: "fileInput",

        chooseButton: "chooseButton",

        sampleButton: "sampleButton",

        dropZone: "dropZone",

        newButton: "newButton",

        exportButton: "exportButton",

        datasetName: "datasetName",

        datasetDescription: "datasetDescription",

        rowCount: "rowCount",

        columnCount: "columnCount",

        numericCount: "numericCount",

        searchField: "searchField",

        profileField: "profileField",

        searchInput: "searchInput",

        clearSearchButton: "clearSearchButton",

        addButton: "addButton",

        tableHead: "tableHead",

        tableBody: "tableBody",

        filterStatus: "filterStatus",

        previousButton: "previousButton",

        nextButton: "nextButton",

        pageStatus: "pageStatus",

        statistics: "statistics",

        benchmarkField: "benchmarkField",

        benchmarkQueries: "benchmarkQueries",

        benchmarkButton: "benchmarkButton",

        benchmarkResults: "benchmarkResults",

        recordDialog: "recordDialog",

        recordForm: "recordForm",

        recordFields: "recordFields",

        dialogTitle: "dialogTitle",

        closeDialogButton: "closeDialogButton",

        cancelDialogButton: "cancelDialogButton",

        toast: "toast"
    };


    const elements = {};

    const missing = [];


    for (const [name, id] of Object.entries(elementIds)) {

        elements[name] =
            document.getElementById(id);


        if (!elements[name]) {

            missing.push(`#${id}`);
        }
    }


    /*
        Instead of crashing on a mysterious:

        Cannot read properties of null

        this tells us exactly which HTML element
        is missing.
    */

    if (missing.length) {

        console.error(
            "Data Workbench could not start. Missing HTML elements:",
            missing.join(", ")
        );

        return;
    }



    // ============================================================
    // GENERAL UTILITIES
    // ============================================================

    let papaPromise = null;


    function createId() {

        if (
            window.crypto &&
            crypto.randomUUID
        ) {

            return crypto.randomUUID();
        }


        return (
            `${Date.now()}-` +
            Math.random()
                .toString(16)
                .slice(2)
        );
    }



    function valueToString(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";
        }


        if (typeof value === "object") {

            return JSON.stringify(value);
        }


        return String(value);
    }



    function escapeHTML(value) {

        return String(value)

            .replaceAll("&", "&amp;")

            .replaceAll("<", "&lt;")

            .replaceAll(">", "&gt;")

            .replaceAll('"', "&quot;")

            .replaceAll("'", "&#039;");
    }



    function showMessage(
        message,
        error = false
    ) {

        elements.toast.textContent =
            message;


        elements.toast.classList.toggle(
            "error",
            error
        );


        elements.toast.hidden =
            false;


        clearTimeout(
            showMessage.timer
        );


        showMessage.timer =
            setTimeout(
                () => {

                    elements.toast.hidden =
                        true;
                },

                3500
            );
    }



    // ============================================================
    // NUMBER HANDLING
    // ============================================================

    function parseNumber(value) {

        const text =
            String(value ?? "")
                .trim();


        if (!text) {

            return null;
        }


        /*
            Handles:

            1000
            1,000
            -25
            3.14
            1.5e4
        */

        const normalized =
            text.replaceAll(",", "");


        const numberPattern =
            /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;


        if (
            !numberPattern.test(
                normalized
            )
        ) {

            return null;
        }


        const number =
            Number(normalized);


        return Number.isFinite(number)
            ? number
            : null;
    }



    function formatNumber(number) {

        return Number(number)
            .toLocaleString(
                undefined,
                {
                    maximumFractionDigits: 3
                }
            );
    }



    // ============================================================
    // LOAD PAPA PARSE
    // ============================================================

    function ensurePapaParse() {

        if (window.Papa) {

            return Promise.resolve(
                window.Papa
            );
        }


        if (papaPromise) {

            return papaPromise;
        }


        papaPromise =
            new Promise(
                (resolve, reject) => {

                    const script =
                        document.createElement(
                            "script"
                        );


                    script.src =
                        PAPA_PARSE_CDN;


                    script.async =
                        true;


                    script.crossOrigin =
                        "anonymous";


                    script.onload =
                        () => {

                            if (window.Papa) {

                                resolve(
                                    window.Papa
                                );

                            } else {

                                reject(
                                    new Error(
                                        "Papa Parse loaded, but the parser was unavailable."
                                    )
                                );
                            }
                        };


                    script.onerror =
                        () => {

                            reject(
                                new Error(
                                    "Could not load the CSV parser."
                                )
                            );
                        };


                    document.head.appendChild(
                        script
                    );
                }
            );


        return papaPromise;
    }



    // ============================================================
    // CSV HEADER HANDLING
    // ============================================================

    function makeUniqueHeaders(
        rawHeaders
    ) {

        const seen =
            new Map();


        const headers = [];


        rawHeaders.forEach(
            (
                rawHeader,
                sourceIndex
            ) => {

                let name =
                    String(
                        rawHeader ?? ""
                    )

                        .replace(
                            /^\uFEFF/,
                            ""
                        )

                        .trim();


                /*
                    IMPORTANT:

                    Empty header cells are ignored.

                    This is what prevents:

                    Column 8
                    Column 9
                    Column 10
                    ...
                */

                if (!name) {

                    return;
                }


                const count =
                    (
                        seen.get(name) ||
                        0
                    ) + 1;


                seen.set(
                    name,
                    count
                );


                /*
                    Duplicate columns are still
                    supported safely.

                    Example:

                    price
                    price (2)
                */

                if (count > 1) {

                    name =
                        `${name} (${count})`;
                }


                headers.push({

                    name,

                    sourceIndex
                });
            }
        );


        return headers;
    }



    // ============================================================
    // CSV / TSV PARSER
    // ============================================================

    async function parseDelimited(
        text,
        delimiter = ""
    ) {

        const Papa =
            await ensurePapaParse();


        /*
            We intentionally parse as arrays
            instead of using header:true.

            That gives us complete control over
            the schema.
        */

        const result =
            Papa.parse(
                text,
                {

                    header: false,

                    skipEmptyLines:
                        "greedy",

                    delimiter,

                    dynamicTyping:
                        false
                }
            );


        const rows =
            result.data;


        if (!rows.length) {

            throw new Error(
                "The dataset contains no rows."
            );
        }


        /*
            The first row defines the schema.
        */

        const rawHeaders =
            rows[0];


        const headerMap =
            makeUniqueHeaders(
                rawHeaders
            );


        if (!headerMap.length) {

            throw new Error(
                "The dataset does not contain a valid header row."
            );
        }


        const columns =
            headerMap.map(
                header =>
                    header.name
            );


        const records = [];


        let extraFieldRows = 0;



        // ========================================================
        // CONVERT CSV ROWS TO OBJECTS
        // ========================================================

        for (
            let rowIndex = 1;

            rowIndex < rows.length;

            rowIndex++
        ) {

            const sourceRow =
                rows[rowIndex];


            /*
                If a malformed row has fields
                beyond the original header width,
                ignore them.

                They do NOT become new columns.
            */

            if (

                sourceRow.length >
                    rawHeaders.length

                &&

                sourceRow

                    .slice(
                        rawHeaders.length
                    )

                    .some(
                        value =>
                            String(
                                value ?? ""
                            )
                                .trim() !== ""
                    )
            ) {

                extraFieldRows++;
            }



            const record = {};


            for (
                const header
                of headerMap
            ) {

                record[
                    header.name
                ] =

                    valueToString(

                        sourceRow[
                            header.sourceIndex
                        ] ?? ""
                    )

                    .trim();
            }



            /*
                Ignore rows that contain
                absolutely no usable data.
            */

            const hasData =
                columns.some(

                    column =>

                        String(
                            record[
                                column
                            ] ?? ""
                        )

                        .trim() !== ""
                );


            if (hasData) {

                records.push(
                    record
                );
            }
        }



        return {

            records,

            columns,

            errors:
                result.errors || [],

            extraFieldRows,

            delimiter:
                result.meta?.delimiter ||
                delimiter ||
                ","
        };
    }



    // ============================================================
    // JSON PARSER
    // ============================================================

    function parseJSON(text) {

        const parsed =
            JSON.parse(text);


        let sourceRecords;


        /*
            Supports:

            [
                {...},
                {...}
            ]

            or:

            {
                "data": [...]
            }

            or:

            {
                "name": "example"
            }
        */

        if (
            Array.isArray(parsed)
        ) {

            sourceRecords =
                parsed;
        }


        else if (
            parsed &&
            Array.isArray(
                parsed.data
            )
        ) {

            sourceRecords =
                parsed.data;
        }


        else if (
            parsed &&
            typeof parsed ===
                "object"
        ) {

            sourceRecords =
                [parsed];
        }


        else {

            throw new Error(
                "JSON must contain an object or an array of objects."
            );
        }



        const valid =
            sourceRecords.every(

                record =>

                    record &&

                    typeof record ===
                        "object"

                    &&

                    !Array.isArray(
                        record
                    )
            );


        if (!valid) {

            throw new Error(
                "Every JSON record must be an object."
            );
        }



        /*
            JSON doesn't necessarily have
            a header row, so use the union
            of all object keys.
        */

        const columns = [];

        const seen =
            new Set();


        for (
            const record
            of sourceRecords
        ) {

            for (
                const key
                of Object.keys(
                    record
                )
            ) {

                if (
                    !seen.has(key)
                ) {

                    seen.add(key);

                    columns.push(
                        key
                    );
                }
            }
        }



        if (!columns.length) {

            throw new Error(
                "The JSON dataset does not contain any fields."
            );
        }



        return {

            records:
                sourceRecords,

            columns,

            errors: [],

            extraFieldRows: 0
        };
    }



    // ============================================================
    // NORMALIZE DATA
    // ============================================================

    function normalizeDataset(
        records,
        columns
    ) {

        return records.map(
            record => {

                const normalized = {

                    [ROW_ID]:
                        createId()
                };


                for (
                    const column
                    of columns
                ) {

                    normalized[
                        column
                    ] =

                        valueToString(

                            record[
                                column
                            ]
                        );
                }


                return normalized;
            }
        );
    }



    // ============================================================
    // NUMERIC COLUMN DETECTION
    // ============================================================

    function detectNumericColumns() {

        const numericColumns =
            new Set();


        for (
            const column
            of state.columns
        ) {

            const nonEmptyValues =

                state.records

                    .map(
                        record =>
                            String(
                                record[
                                    column
                                ] ?? ""
                            )
                            .trim()
                    )

                    .filter(
                        value =>
                            value !== ""
                    );


            if (
                !nonEmptyValues.length
            ) {

                continue;
            }



            const numericValues =

                nonEmptyValues.filter(

                    value =>
                        parseNumber(
                            value
                        ) !== null
                );


            /*
                A column is considered numeric
                if 80% or more of its populated
                values are numbers.

                This lets datasets contain markers
                such as:

                C
                N/A
                missing

                while still recognizing the
                underlying numeric column.
            */

            const numericRatio =

                numericValues.length /

                nonEmptyValues.length;


            if (
                numericRatio >= 0.8
            ) {

                numericColumns.add(
                    column
                );
            }
        }


        state.numericColumns =
            numericColumns;
    }



    // ============================================================
    // FILE LOADING
    // ============================================================

    async function loadFile(file) {

        if (!file) {

            return;
        }


        try {

            const extension =

                file.name

                    .split(".")

                    .pop()

                    .toLowerCase();



            if (

                ![
                    "csv",
                    "tsv",
                    "json"
                ]

                .includes(
                    extension
                )
            ) {

                throw new Error(
                    "Please choose a CSV, TSV, or JSON file."
                );
            }



            const text =
                await file.text();


            let parsed;



            if (
                extension === "json"
            ) {

                parsed =
                    parseJSON(text);
            }


            else if (
                extension === "tsv"
            ) {

                parsed =
                    await parseDelimited(
                        text,
                        "\t"
                    );
            }


            else {

                /*
                    Empty delimiter causes
                    Papa Parse to automatically
                    detect the CSV delimiter.
                */

                parsed =
                    await parseDelimited(
                        text,
                        ""
                    );
            }



            if (
                !parsed.records.length
            ) {

                throw new Error(
                    "The file contains no usable records."
                );
            }



            // ====================================================
            // RESET APPLICATION STATE
            // ====================================================

            state.fileName =
                file.name;


            state.columns =
                parsed.columns;


            state.records =

                normalizeDataset(

                    parsed.records,

                    parsed.columns
                );


            state.query =
                "";


            state.searchField =
                "__all__";


            state.profileField =
                parsed.columns[0] ||
                null;


            state.sortColumn =
                null;


            state.sortDirection =
                "asc";


            state.page =
                1;


            state.editingId =
                null;



            detectNumericColumns();

            buildColumnMenus();



            elements.searchInput.value =
                "";


            elements.searchField.value =
                "__all__";


            elements.benchmarkResults.innerHTML =
                "";


            elements.uploadSection.hidden =
                true;


            elements.workspace.hidden =
                false;


            elements.exportButton.disabled =
                false;



            render();



            // ====================================================
            // PARSER WARNINGS
            // ====================================================

            const warningParts = [];


            if (
                parsed.extraFieldRows > 0
            ) {

                warningParts.push(

                    `${parsed.extraFieldRows} row(s) contained extra cells that were ignored`
                );
            }


            if (
                parsed.errors.length > 0
            ) {

                console.warn(
                    "Dataset parser warnings:",
                    parsed.errors
                );
            }



            if (
                warningParts.length
            ) {

                showMessage(

                    `Loaded ${state.records.length.toLocaleString()} records. ${warningParts.join(". ")}.`
                );

            } else {

                showMessage(

                    `Loaded ${state.records.length.toLocaleString()} records.`
                );
            }

        }

        catch (error) {

            console.error(
                error
            );


            showMessage(

                error.message ||

                "Could not load the dataset.",

                true
            );

        }

        finally {

            /*
                Allows selecting the same
                file again afterward.
            */

            elements.fileInput.value =
                "";
        }
    }



    async function loadSampleDataset() {

        try {

            const response =
                await fetch(
                    "./sample-enterprise-data.csv",
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Could not load the sample dataset."
                );
            }


            const blob =
                await response.blob();


            const file =
                new File(
                    [blob],
                    "sample-enterprise-data.csv",
                    {
                        type:
                            blob.type ||
                            "text/csv"
                    }
                );


            await loadFile(file);

        }

        catch (error) {

            console.error(error);

            showMessage(
                error.message ||
                "Could not load the sample dataset.",
                true
            );
        }
    }



    // ============================================================
    // COLUMN SELECT MENUS
    // ============================================================

    function buildColumnMenus() {

        elements.searchField.innerHTML =
            "";

        elements.profileField.innerHTML =
            "";

        elements.benchmarkField.innerHTML =
            "";


        const allOption =
            document.createElement(
                "option"
            );

        allOption.value =
            "__all__";

        allOption.textContent =
            "All Columns";

        elements.searchField.appendChild(
            allOption
        );


        for (
            const column
            of state.columns
        ) {

            const searchOption =
                document.createElement(
                    "option"
                );

            searchOption.value =
                column;

            searchOption.textContent =
                column;

            elements.searchField.appendChild(
                searchOption
            );


            const profileOption =
                document.createElement(
                    "option"
                );

            profileOption.value =
                column;

            profileOption.textContent =
                column;

            elements.profileField.appendChild(
                profileOption
            );


            const benchmarkOption =
                document.createElement(
                    "option"
                );

            benchmarkOption.value =
                column;

            benchmarkOption.textContent =
                column;

            elements.benchmarkField.appendChild(
                benchmarkOption
            );
        }


        if (
            !state.profileField ||
            !state.columns.includes(
                state.profileField
            )
        ) {

            state.profileField =
                state.numericColumns
                    .values()
                    .next()
                    .value ||
                state.columns[0] ||
                null;
        }


        if (state.profileField) {

            elements.profileField.value =
                state.profileField;
        }
    }



    // ============================================================
    // SORTING
    // ============================================================

    function compareValues(
        a,
        b,
        column
    ) {

        const aText =
            String(a ?? "");


        const bText =
            String(b ?? "");



        if (
            state.numericColumns.has(
                column
            )
        ) {

            const aNumber =
                parseNumber(
                    aText
                );


            const bNumber =
                parseNumber(
                    bText
                );


            if (

                aNumber !== null &&

                bNumber !== null
            ) {

                return (
                    aNumber -
                    bNumber
                );
            }


            /*
                Put numeric values before
                non-numeric markers.
            */

            if (
                aNumber !== null
            ) {

                return -1;
            }


            if (
                bNumber !== null
            ) {

                return 1;
            }
        }



        return aText.localeCompare(

            bText,

            undefined,

            {

                numeric: true,

                sensitivity:
                    "base"
            }
        );
    }



    // ============================================================
    // FILTERED / SORTED RECORDS
    // ============================================================

    function getVisibleRecords() {

        let records =
            state.records;


        const query =

            state.query

                .trim()

                .toLowerCase();



        // ========================================================
        // SEARCH
        // ========================================================

        if (query) {

            records =
                records.filter(
                    record => {

                        if (

                            state.searchField ===
                            "__all__"
                        ) {

                            return (
                                state.columns.some(

                                    column =>

                                        String(
                                            record[
                                                column
                                            ] ?? ""
                                        )

                                        .toLowerCase()

                                        .includes(
                                            query
                                        )
                                )
                            );
                        }


                        return (

                            String(
                                record[
                                    state.searchField
                                ] ?? ""
                            )

                            .toLowerCase()

                            .includes(
                                query
                            )
                        );
                    }
                );
        }



        // ========================================================
        // SORT
        // ========================================================

        if (
            state.sortColumn
        ) {

            const multiplier =

                state.sortDirection ===
                "asc"

                    ? 1

                    : -1;


            const column =
                state.sortColumn;


            records =

                [...records].sort(

                    (a, b) =>

                        compareValues(

                            a[column],

                            b[column],

                            column
                        )

                        * multiplier
                );
        }



        return records;
    }



    // ============================================================
    // RENDER APPLICATION
    // ============================================================

    function render() {

        detectNumericColumns();

        renderDatasetInfo();

        renderTable();

        renderStatistics();
    }



    // ============================================================
    // DATASET INFORMATION
    // ============================================================

    function renderDatasetInfo() {

        elements.datasetName.textContent =
            state.fileName ||
            "Dataset";


        elements.datasetDescription.textContent =
            "Editable browser dataset";


        elements.rowCount.textContent =
            state.records.length
                .toLocaleString();


        elements.columnCount.textContent =
            state.columns.length
                .toLocaleString();


        elements.numericCount.textContent =
            state.numericColumns.size
                .toLocaleString();
    }



    // ============================================================
    // TABLE HEADER
    // ============================================================

    function renderTableHeader() {

        elements.tableHead.innerHTML =
            "";


        const row =
            document.createElement(
                "tr"
            );


        for (
            const column
            of state.columns
        ) {

            const header =
                document.createElement(
                    "th"
                );


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            let indicator =
                "";


            if (
                state.sortColumn ===
                column
            ) {

                indicator =

                    state.sortDirection ===
                    "asc"

                        ? " ▲"

                        : " ▼";
            }


            button.textContent =
                column +
                indicator;


            button.addEventListener(

                "click",

                () =>
                    sortBy(column)
            );


            header.appendChild(
                button
            );


            row.appendChild(
                header
            );
        }



        const actionsHeader =
            document.createElement(
                "th"
            );


        actionsHeader.textContent =
            "Actions";


        row.appendChild(
            actionsHeader
        );


        elements.tableHead.appendChild(
            row
        );
    }



    // ============================================================
    // TABLE BODY
    // ============================================================

    function renderTable() {

        const records =
            getVisibleRecords();


        const totalPages =

            Math.max(

                1,

                Math.ceil(

                    records.length /

                    state.pageSize
                )
            );


        if (
            state.page >
            totalPages
        ) {

            state.page =
                totalPages;
        }



        const start =

            (
                state.page -
                1
            )

            * state.pageSize;



        const pageRecords =

            records.slice(

                start,

                start +
                state.pageSize
            );



        renderTableHeader();


        elements.tableBody.innerHTML =
            "";



        for (
            const record
            of pageRecords
        ) {

            const row =
                document.createElement(
                    "tr"
                );


            for (
                const column
                of state.columns
            ) {

                const cell =
                    document.createElement(
                        "td"
                    );


                const value =
                    String(
                        record[
                            column
                        ] ?? ""
                    );


                cell.textContent =
                    value;


                cell.title =
                    value;


                row.appendChild(
                    cell
                );
            }



            // ====================================================
            // ACTIONS
            // ====================================================

            const actions =
                document.createElement(
                    "td"
                );


            actions.className =
                "actions";



            const editButton =
                document.createElement(
                    "button"
                );


            editButton.type =
                "button";


            editButton.textContent =
                "Edit";


            editButton.className =
                "action-button";


            editButton.addEventListener(

                "click",

                () =>
                    openRecordDialog(
                        record
                    )
            );



            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.type =
                "button";


            deleteButton.textContent =
                "Delete";


            deleteButton.className =
                "action-button delete-button";


            deleteButton.addEventListener(

                "click",

                () =>
                    deleteRecord(
                        record
                    )
            );



            actions.append(

                editButton,

                deleteButton
            );


            row.appendChild(
                actions
            );


            elements.tableBody.appendChild(
                row
            );
        }



        elements.filterStatus.textContent =

            `${records.length.toLocaleString()} record${

                records.length === 1
                    ? ""
                    : "s"
            }`;



        elements.pageStatus.textContent =

            `Page ${state.page} of ${totalPages}`;



        elements.previousButton.disabled =

            state.page <= 1;



        elements.nextButton.disabled =

            state.page >=
            totalPages;
    }



    // ============================================================
    // SORT
    // ============================================================

    function sortBy(column) {

        if (
            state.sortColumn ===
            column
        ) {

            state.sortDirection =

                state.sortDirection ===
                "asc"

                    ? "desc"

                    : "asc";

        } else {

            state.sortColumn =
                column;


            state.sortDirection =
                "asc";
        }


        state.page =
            1;


        renderTable();
    }



    // ============================================================
    // STATISTICS
    // ============================================================

    function renderStatistics() {

        elements.statistics.innerHTML =
            "";


        const column =
            state.profileField;


        if (
            !column ||
            !state.columns.includes(column)
        ) {

            const message =
                document.createElement(
                    "p"
                );

            message.className =
                "muted";

            message.textContent =
                "Choose a column to inspect.";

            elements.statistics.appendChild(
                message
            );

            return;
        }


        const values =
            state.records.map(
                record =>
                    String(
                        record[column] ??
                        ""
                    )
            );


        const populated =
            values.filter(
                value =>
                    value.trim() !== ""
            );


        const missing =
            values.length -
            populated.length;


        const unique =
            new Set(
                populated
            ).size;


        const summary = [
            ["Rows", values.length],
            ["Non-empty", populated.length],
            ["Missing", missing],
            ["Unique", unique]
        ];


        const summaryGrid =
            document.createElement(
                "div"
            );

        summaryGrid.className =
            "profile-summary";


        for (
            const [label, value]
            of summary
        ) {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "profile-stat";

            item.innerHTML = `
                <span>${escapeHTML(label)}</span>
                <strong>${Number(value).toLocaleString()}</strong>
            `;

            summaryGrid.appendChild(
                item
            );
        }


        elements.statistics.appendChild(
            summaryGrid
        );


        if (
            !state.numericColumns.has(
                column
            )
        ) {

            const note =
                document.createElement(
                    "p"
                );

            note.className =
                "muted small";

            note.textContent =
                "Text column — numeric statistics are not applicable.";

            elements.statistics.appendChild(
                note
            );

            return;
        }


        const numbers =
            populated
                .map(parseNumber)
                .filter(
                    value =>
                        value !== null
                );


        if (!numbers.length) {

            return;
        }


        const sorted =
            [...numbers].sort(
                (a, b) =>
                    a - b
            );


        const total =
            numbers.reduce(
                (sum, value) =>
                    sum + value,
                0
            );


        const mean =
            total /
            numbers.length;


        const middle =
            Math.floor(
                sorted.length /
                2
            );


        const median =
            sorted.length % 2 === 0
                ? (
                    sorted[middle - 1] +
                    sorted[middle]
                ) / 2
                : sorted[middle];


        const numeric = [
            ["Mean", mean],
            ["Median", median],
            ["Min", sorted[0]],
            ["Max", sorted[sorted.length - 1]]
        ];


        const numericGrid =
            document.createElement(
                "div"
            );

        numericGrid.className =
            "profile-summary numeric-profile";


        for (
            const [label, value]
            of numeric
        ) {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "profile-stat";

            item.innerHTML = `
                <span>${escapeHTML(label)}</span>
                <strong>${formatNumber(value)}</strong>
            `;

            numericGrid.appendChild(
                item
            );
        }


        elements.statistics.appendChild(
            numericGrid
        );
    }



    // ============================================================
    // ADD / EDIT RECORD
    // ============================================================

    function openRecordDialog(
        record = null
    ) {

        state.editingId =

            record
                ? record[ROW_ID]
                : null;



        elements.dialogTitle.textContent =

            record
                ? "Edit Record"
                : "Add Record";



        elements.recordFields.innerHTML =
            "";



        /*
            Generate the form dynamically.

            The form therefore works with
            ANY dataset schema.
        */

        for (
            const column
            of state.columns
        ) {

            const label =
                document.createElement(
                    "label"
                );


            label.textContent =
                column;



            const input =
                document.createElement(
                    "input"
                );


            input.type =
                "text";


            input.name =
                column;


            input.value =

                record

                    ? String(
                        record[
                            column
                        ] ?? ""
                    )

                    : "";



            if (
                state.numericColumns.has(
                    column
                )
            ) {

                input.inputMode =
                    "decimal";
            }



            label.appendChild(
                input
            );


            elements.recordFields.appendChild(
                label
            );
        }



        elements.recordDialog.showModal();
    }



    function closeRecordDialog() {

        if (
            elements.recordDialog.open
        ) {

            elements.recordDialog.close();
        }


        state.editingId =
            null;
    }



    function saveRecord(event) {

        event.preventDefault();


        const formData =
            new FormData(
                elements.recordForm
            );


        const data = {};


        for (
            const column
            of state.columns
        ) {

            data[column] =

                valueToString(

                    formData.get(
                        column
                    ) ?? ""
                );
        }



        const hasData =

            state.columns.some(

                column =>

                    String(
                        data[
                            column
                        ] ?? ""
                    )

                    .trim() !== ""
            );


        if (!hasData) {

            showMessage(
                "A record cannot be completely empty.",
                true
            );

            return;
        }



        // ========================================================
        // EDIT EXISTING
        // ========================================================

        if (
            state.editingId
        ) {

            const record =

                state.records.find(

                    item =>

                        item[ROW_ID] ===
                        state.editingId
                );


            if (!record) {

                showMessage(
                    "The record could not be found.",
                    true
                );

                return;
            }



            for (
                const column
                of state.columns
            ) {

                record[column] =
                    data[column];
            }


            showMessage(
                "Record updated."
            );
        }



        // ========================================================
        // ADD NEW
        // ========================================================

        else {

            const record = {

                [ROW_ID]:
                    createId()
            };


            for (
                const column
                of state.columns
            ) {

                record[column] =
                    data[column];
            }


            state.records.push(
                record
            );


            showMessage(
                "Record added."
            );
        }



        closeRecordDialog();

        render();
    }



    // ============================================================
    // DELETE RECORD
    // ============================================================

    function deleteRecord(record) {

        const confirmed =
            window.confirm(
                "Delete this record?"
            );


        if (!confirmed) {

            return;
        }



        state.records =

            state.records.filter(

                item =>

                    item[ROW_ID] !==
                    record[ROW_ID]
            );


        render();


        showMessage(
            "Record deleted."
        );
    }



    // ============================================================
    // CSV EXPORT
    // ============================================================

    function csvValue(value) {

        const text =
            String(value ?? "");


        if (

            text.includes(",")

            ||

            text.includes('"')

            ||

            text.includes("\n")

            ||

            text.includes("\r")
        ) {

            return (

                '"' +

                text.replaceAll(
                    '"',
                    '""'
                )

                +

                '"'
            );
        }


        return text;
    }



    function exportCSV() {

        if (

            !state.records.length ||

            !state.columns.length
        ) {

            return;
        }



        const lines = [];


        // Header

        lines.push(

            state.columns

                .map(
                    csvValue
                )

                .join(",")
        );



        // Rows

        for (
            const record
            of state.records
        ) {

            lines.push(

                state.columns

                    .map(
                        column =>
                            csvValue(
                                record[
                                    column
                                ]
                            )
                    )

                    .join(",")
            );
        }



        const blob =

            new Blob(

                [
                    lines.join(
                        "\r\n"
                    )
                ],

                {

                    type:
                        "text/csv;charset=utf-8"
                }
            );



        const url =

            URL.createObjectURL(
                blob
            );



        const link =

            document.createElement(
                "a"
            );



        const baseName =

            state.fileName

                .replace(
                    /\.[^.]+$/,
                    ""
                )

            ||

            "dataset";



        link.href =
            url;


        link.download =
            `${baseName}-edited.csv`;



        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );


        showMessage(
            "CSV exported."
        );
    }



        // ============================================================
    // BINARY SEARCH
    // ============================================================

    function binarySearch(
        array,
        target,
        compare
    ) {

        let low = 0;

        let high =
            array.length - 1;


        while (
            low <= high
        ) {

            const middle =

                Math.floor(
                    (
                        low +
                        high
                    )
                    / 2
                );


            const value =
                array[middle];


            const comparison =
                compare(
                    value,
                    target
                );


            if (
                comparison === 0
            ) {

                return true;
            }


            if (
                comparison < 0
            ) {

                low =
                    middle + 1;

            } else {

                high =
                    middle - 1;
            }
        }


        return false;
    }



    // ============================================================
    // BENCHMARK COMPARATORS
    // ============================================================

    function compareBenchmarkText(
        a,
        b
    ) {

        if (
            a === b
        ) {

            return 0;
        }


        return (
            a < b
                ? -1
                : 1
        );
    }



    function compareBenchmarkNumber(
        a,
        b
    ) {

        return (
            a - b
        );
    }



    // ============================================================
    // PERFORMANCE BENCHMARK
    // ============================================================

    function runBenchmark() {

        const field =
            elements.benchmarkField.value;


        if (!field) {

            return;
        }



        let queryCount =

            Number(
                elements
                    .benchmarkQueries
                    .value
            );


        if (
            !Number.isFinite(
                queryCount
            )
        ) {

            queryCount =
                1000;
        }



        queryCount =

            Math.max(
                10,
                Math.min(
                    Math.floor(
                        queryCount
                    ),
                    5000
                )
            );


        elements.benchmarkQueries.value =
            queryCount;



        // ========================================================
        // FIELD TYPE
        // ========================================================

        const numericField =

            state.numericColumns.has(
                field
            );



        /*
            Build a common set of benchmark entries.

            Every search strategy works against
            the same normalized keys.

            Numeric fields use actual numbers.
            Text fields use exact strings.
        */

        const entries = [];


        for (
            const record
            of state.records
        ) {

            const rawValue =

                String(
                    record[
                        field
                    ] ?? ""
                );


            if (
                rawValue === ""
            ) {

                continue;
            }



            if (
                numericField
            ) {

                const number =
                    parseNumber(
                        rawValue
                    );


                /*
                    Numeric columns can still contain
                    markers such as N/A or missing.

                    Those values are excluded from the
                    numeric benchmark so all three
                    strategies operate on comparable keys.
                */

                if (
                    number === null
                ) {

                    continue;
                }


                entries.push({

                    record,

                    key:
                        number
                });

            } else {

                entries.push({

                    record,

                    key:
                        rawValue
                });
            }
        }



        if (
            !entries.length
        ) {

            showMessage(
                "This column contains no searchable values.",
                true
            );

            return;
        }



        // ========================================================
        // RANDOM TEST QUERIES
        // ========================================================

        /*
            Queries are sampled once and reused by
            every strategy.

            This keeps the workload identical.
        */

        const queries =

            Array.from(
                {
                    length:
                        queryCount
                },

                () =>

                    entries[
                        Math.floor(
                            Math.random()
                            *
                            entries.length
                        )
                    ].key
            );



        // ========================================================
        // LINEAR ARRAY SEARCH
        // ========================================================

        const linearStart =
            performance.now();


        for (
            const query
            of queries
        ) {

            entries.find(

                entry =>
                    entry.key ===
                    query
            );
        }


        const linearSearchTime =

            performance.now()
            -
            linearStart;



        // ========================================================
        // MAP / HASH INDEX
        // ========================================================

        const mapBuildStart =
            performance.now();


        const map =
            new Map();


        for (
            const entry
            of entries
        ) {

            if (
                !map.has(
                    entry.key
                )
            ) {

                map.set(
                    entry.key,
                    entry.record
                );
            }
        }


        const mapBuildTime =

            performance.now()
            -
            mapBuildStart;



        const mapSearchStart =
            performance.now();


        for (
            const query
            of queries
        ) {

            map.get(
                query
            );
        }


        const mapSearchTime =

            performance.now()
            -
            mapSearchStart;



        // ========================================================
        // SORTED ARRAY / BINARY SEARCH
        // ========================================================

        const sortedBuildStart =
            performance.now();


        const sorted =

            entries.map(
                entry =>
                    entry.key
            );


        /*
            Numeric fields use a numeric comparator.

            Text fields use exact lexical ordering.

            This avoids the much more expensive
            locale-aware string comparison for values
            that are already known to be numeric.
        */

        if (
            numericField
        ) {

            sorted.sort(
                compareBenchmarkNumber
            );

        } else {

            sorted.sort(
                compareBenchmarkText
            );
        }


        const sortedBuildTime =

            performance.now()
            -
            sortedBuildStart;



        const sortedSearchStart =
            performance.now();


        const comparator =

            numericField

                ? compareBenchmarkNumber

                : compareBenchmarkText;



        for (
            const query
            of queries
        ) {

            binarySearch(
                sorted,
                query,
                comparator
            );
        }


        const sortedSearchTime =

            performance.now()
            -
            sortedSearchStart;



        displayBenchmark({

            linearSearchTime,

            mapBuildTime,

            mapSearchTime,

            sortedBuildTime,

            sortedSearchTime
        });
    }


    // ============================================================
    // DISPLAY BENCHMARK
    // ============================================================

    function displayBenchmark(
        results
    ) {

        const {

            linearSearchTime,

            mapBuildTime,

            mapSearchTime,

            sortedBuildTime,

            sortedSearchTime

        } = results;



        elements.benchmarkResults.innerHTML = `

            <div class="benchmark-result">

                <strong>
                    Linear Array
                </strong>

                <span>
                    Build: 0 ms
                </span>

                <span>
                    Search:
                    ${linearSearchTime.toFixed(3)}
                    ms
                </span>

                <span>
                    Total:
                    ${linearSearchTime.toFixed(3)}
                    ms
                </span>

            </div>



            <div class="benchmark-result">

                <strong>
                    Map Index
                </strong>

                <span>
                    Build:
                    ${mapBuildTime.toFixed(3)}
                    ms
                </span>

                <span>
                    Search:
                    ${mapSearchTime.toFixed(3)}
                    ms
                </span>

                <span>
                    Total:
                    ${(mapBuildTime + mapSearchTime).toFixed(3)}
                    ms
                </span>

            </div>



            <div class="benchmark-result">

                <strong>
                    Sorted / Binary Search
                </strong>

                <span>
                    Build:
                    ${sortedBuildTime.toFixed(3)}
                    ms
                </span>

                <span>
                    Search:
                    ${sortedSearchTime.toFixed(3)}
                    ms
                </span>

                <span>
                    Total:
                    ${(sortedBuildTime + sortedSearchTime).toFixed(3)}
                    ms
                </span>

            </div>
        `;
    }



    // ============================================================
    // RESET APPLICATION
    // ============================================================

    function resetApplication() {

        state.fileName =
            "";


        state.records =
            [];


        state.columns =
            [];


        state.numericColumns =
            new Set();


        state.query =
            "";


        state.searchField =
            "__all__";


        state.profileField =
            null;


        state.sortColumn =
            null;


        state.sortDirection =
            "asc";


        state.page =
            1;


        state.editingId =
            null;



        elements.workspace.hidden =
            true;


        elements.uploadSection.hidden =
            false;


        elements.exportButton.disabled =
            true;


        elements.searchInput.value =
            "";


        elements.searchField.innerHTML =
            "";


        elements.profileField.innerHTML =
            "";


        elements.benchmarkField.innerHTML =
            "";


        elements.benchmarkResults.innerHTML =
            "";


        elements.statistics.innerHTML =
            "";


        elements.tableHead.innerHTML =
            "";


        elements.tableBody.innerHTML =
            "";


        elements.fileInput.value =
            "";
    }



    // ============================================================
    // EVENT LISTENERS
    // ============================================================


    // Choose file

    elements.chooseButton.addEventListener(

        "click",

        () => {

            elements.fileInput.click();
        }
    );



    // Sample dataset

    elements.sampleButton.addEventListener(

        "click",

        loadSampleDataset
    );



    // File selected

    elements.fileInput.addEventListener(

        "change",

        event => {

            loadFile(
                event.target.files?.[0]
            );
        }
    );



    // ============================================================
    // DRAG AND DROP
    // ============================================================

    elements.dropZone.addEventListener(

        "dragover",

        event => {

            event.preventDefault();


            elements.dropZone
                .classList
                .add(
                    "dragging"
                );
        }
    );



    elements.dropZone.addEventListener(

        "dragleave",

        () => {

            elements.dropZone
                .classList
                .remove(
                    "dragging"
                );
        }
    );



    elements.dropZone.addEventListener(

        "drop",

        event => {

            event.preventDefault();


            elements.dropZone
                .classList
                .remove(
                    "dragging"
                );


            loadFile(

                event
                    .dataTransfer
                    ?.files?.[0]
            );
        }
    );



    // ============================================================
    // SEARCH
    // ============================================================

    elements.searchInput.addEventListener(

        "input",

        event => {

            state.query =
                event.target.value;


            state.page =
                1;


            renderTable();
        }
    );



    elements.searchField.addEventListener(

        "change",

        event => {

            state.searchField =
                event.target.value;


            state.page =
                1;


            renderTable();
        }
    );



    elements.clearSearchButton.addEventListener(

        "click",

        () => {

            state.query =
                "";


            state.searchField =
                "__all__";


            state.page =
                1;


            elements.searchInput.value =
                "";


            elements.searchField.value =
                "__all__";


            renderTable();
        }
    );



    // ============================================================
    // ADD RECORD
    // ============================================================

    elements.addButton.addEventListener(

        "click",

        () => {

            openRecordDialog();
        }
    );



    // ============================================================
    // DIALOG
    // ============================================================

    elements.closeDialogButton.addEventListener(

        "click",

        closeRecordDialog
    );



    elements.cancelDialogButton.addEventListener(

        "click",

        closeRecordDialog
    );



    elements.recordForm.addEventListener(

        "submit",

        saveRecord
    );



    /*
        Clicking outside the dialog
        closes it.
    */

    elements.recordDialog.addEventListener(

        "click",

        event => {

            if (

                event.target ===
                elements.recordDialog
            ) {

                closeRecordDialog();
            }
        }
    );



    // ============================================================
    // PAGINATION
    // ============================================================

    elements.previousButton.addEventListener(

        "click",

        () => {

            if (
                state.page > 1
            ) {

                state.page--;

                renderTable();
            }
        }
    );



    elements.nextButton.addEventListener(

        "click",

        () => {

            const totalPages =

                Math.max(

                    1,

                    Math.ceil(

                        getVisibleRecords()
                            .length

                        /

                        state.pageSize
                    )
                );


            if (

                state.page <
                totalPages
            ) {

                state.page++;

                renderTable();
            }
        }
    );



    // ============================================================
    // COLUMN PROFILE
    // ============================================================

    elements.profileField.addEventListener(

        "change",

        event => {

            state.profileField =
                event.target.value;

            renderStatistics();
        }
    );



    // ============================================================
    // BENCHMARK
    // ============================================================

    elements.benchmarkButton.addEventListener(

        "click",

        runBenchmark
    );



    // ============================================================
    // EXPORT
    // ============================================================

    elements.exportButton.addEventListener(

        "click",

        exportCSV
    );



    // ============================================================
    // NEW DATASET
    // ============================================================

    elements.newButton.addEventListener(

        "click",

        resetApplication
    );

});
