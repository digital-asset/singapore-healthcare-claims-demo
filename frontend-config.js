/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { DamlLfValue } from '@da/ui-core';

export const version = {
    schema: 'navigator-config',
    major: 2,
    minor: 0
};

export function theme(userId, party, role) {
    return (party == "PrimaryCareProvider" ? { documentBackground: "#344a83" } :
           party == "Patient1" ? { documentBackground: "#4c566e" } :
           party == "Radiologist" ? { documentBackground: "Grey" } :
           party == "InsuranceCompany" ? { documentBackground: "#6f639e" } :
           { documentBackground: "#800000" });
  };

// --- Creating views --------------------------------------------------------------------

const patientsView = createTab("Patients", ":Patient@", [
    createIdCol(),
    createCol("name", "Name", 70),
    createCol("gender", "Gender", 10),
    createCol("nric", "NRIC", 20),
    createCol("dateOfBirth", "Date Of Birth", 20),
    createCol("address", 120),
    // createCol("referrer", "Referred By")
]);

const disclosedPoliciesView = createTab("Disclosed Policies", ":InsurancePolicy@", [
    createIdCol(),
    createCol("insuranceID", "Insurance ID"),
    createCol("insurers", "Insurers", null, r => r.policyDetails.ipInsurer + ", " + r.policyDetails.medishield),
    createCol("policyEndDate", "Policy End Date", null, r => formatDateIntoDDMMMYYYY(r.policyDetails.policyEndDate.substring(0,10))),
    createCol("isPolicyActive", "Is Policy Active", null, r => r.isPolicyInGoodStanding ? "Yes" : "No"),
]);

const policiesView = createTab("Insurance Policies", ":InsurancePolicy@", [
    createIdCol(),
    createCol("insuranceID", "Insurance ID"),
    createCol("insurers", "Insurers", null, r => r.policyDetails.ipInsurer + ", " + r.policyDetails.medishield),
    createCol("policyEndDate", "Policy End Date", null, r => formatDateIntoDDMMMYYYY(r.policyDetails.policyEndDate.substring(0,10))),
    createCol("isPolicyActive", "Is Policy Active", null, r => r.isPolicyInGoodStanding ? "Yes" : "No"),
]);

const appointmentsView = createTab("Appointments", ":Appointment@", [
    createIdCol(),
    createCol("patientName", "Patient", null, r => r.patientDetails.name),
    createCol("date", "Date", null, r => formatDateIntoDDMMMYYYY(r.dateAndTime.substring(0,10))),
    createCol("time", "Time", null, r => formatDateIntoAMPM(r.dateAndTime.substring(11,13), r.dateAndTime.substring(14,16))),
    createCol("procedure", "Procedure", null, r => r.procedureDetails.procedureCode + ", " + r.procedureDetails.procedureName.replace(/_/g, ' ')),
]);

const treatmentsView = createTab("Treatments", ":Treatment@", [
    createIdCol(),
    createCol("patientName", "Patient", null, r => r.patientDetails.name),
    createCol("date", "Treatment Date", null, r => formatDateIntoDDMMMYYYY(r.treatmentDate.substring(0,10))),
    createCol("costOfTreatment", "Treatment Cost", null, r => r.currency + " " + r.procedureDetails.cost),
    createCol("procedure", "Procedure", null, r => r.procedureDetails.procedureCode + ", " + r.procedureDetails.procedureName.replace(/_/g, ' ')),
]);

const claimsView = createTab("Open Claims", ":Claim@", [
    createCol("claimID", "Claim ID", 10),
    createCol("sender", "Payment Sender", 40),
    createCol("receiver", "Payment Receiver", 40),
    createCol("amount", "Amount", 40, r => r.currency + " " + r.amount),
    createCol("dateOfClaimCreation", "Date Of Claim Creation", 60, r => formatDateIntoDDMMMYYYY(r.dateOfClaimCreation.substring(0,10))),
    createCol("procedure", "Procedure", 100, r => r.treatmentDetails.procedureDetails.procedureCode + ", " + r.treatmentDetails.procedureDetails.procedureName.replace(/_/g, ' ')),
]);

const transfersView = createTab("Paid Claims", ":Transfer@", [
    createCol("claimID", "Claim ID", 20),
    createCol("transactionID", "Transaction ID", 200, r => { if('Completed' in r.status) return r.status.Completed.transactionId; else return "NA"; }),
    createCol("sender", "Payment Sender"),
    createCol("receiver", "Payment Receiver"),
    createCol("amount", "Amount", null, r => r.currency + " " + r.amount),
    createCol("status", "Status", null, r => { if('Completed' in r.status) return "Completed"; else return "Error"; })
]);

const walletView = createTab("Wallet", ":Wallet", [
    createCol("owner", "Owner", null, r => r.content.holder),
    createCol("balance", "Balance", null, r => r.content.currency + " " + r.content.amount),
    createCol("lastUpdatedAt", "Last Updated At", null, r => formatDateIntoAMPM(r.content.updated.substring(11,13), r.content.updated.substring(14,16))),
]);

const medisaveWalletView = createTab("MediSave Wallet", ":Wallet", [
    createCol("owner", "Owner", null, r => r.content.holder),
    createCol("balance", "Balance", null, r => r.content.currency + " " + r.content.amount),
    createCol("lastUpdatedAt", "Last Updated At", null, r => formatDateIntoAMPM(r.content.updated.substring(11,13), r.content.updated.substring(14,16))),
]);

const ubinWalletView = createTab("Wallet", ":Wallet@", [
    createCol("owner", "Owner", null, r => r.content.holder),
    createCol("balance", "Balance", null, r => r.content.currency + " " + r.content.amount),
    createCol("lastUpdatedAt", "Last Updated At", null, r => formatDateIntoAMPM(r.content.updated.substring(11,13), r.content.updated.substring(14,16))),
]);

const ubinTransfersView = createTab("Transfers", ":Transfer@", [
    createCol("transactionID", "Transaction ID", 200, r => { if('Completed' in r.status) return r.status.Completed.transactionId; else return "NA"; }),
    createCol("sender", "Payment Sender"),
    createCol("receiver", "Payment Receiver"),
    createCol("amount", "Amount", null, r => r.currency + " " + r.amount),
    createCol("status", "Status", null, r => { if('Completed' in r.status) return "Completed"; else return "Error"; })
]);


// --- Assigning views to parties --------------------------------------------------------------------

export const customViews = (userId, party, role) => {
    if (party == 'Hospital') {
        return {
            patientsView,
            disclosedPoliciesView,
            appointmentsView,
            treatmentsView,
            claimsView,
            transfersView,
            walletView
        };
    }

    if (party == 'Patient') {
        return {
            policiesView,
            appointmentsView,
            treatmentsView,
            claimsView,
            transfersView,
            medisaveWalletView
        };
    }

    if (party == 'MediShield Life') {
        return {
            policiesView,
            claimsView,
            transfersView,
            walletView
        };
    }

    if (party == 'IP Insurer') {
        return {
            policiesView,
            claimsView,
            transfersView,
            walletView
        };
    }
    
    if (party == 'Ubin') {
        return {
            ubinTransfersView,
            ubinWalletView
        };
    }

    return {
    };
};


// --- Helpers --------------------------------------------------------------------

/**
 title, width and proj are optional

 if proj is null and key is "id" then it will default to the contract id
 if proj is null and key is not "id" then it will default to stringified single or array value of rowData.key
*/
function createCol(key, title = toTitle(key), width = 80, proj) {
    return {
        key: key,
        title: title,
        createCell: ({ rowData }) => ({
            type: "text",
            value: valueFunction(rowData, key, proj)
        }),
        sortable: true,
        width: width,
        weight: 0,
        alignment: "left"
    };
}

function createIdCol() {
    return createCol("id", "Contract ID", 60);
}

function createTab(name, templateId, columns, additionalFilter) {
    var filter;
    if (additionalFilter == null) {
        filter =
        [
            {
                field: "template.id",
                value: templateId
            }
        ]
    } else {
        filter =
        [
            {
                field: "template.id",
                value: templateId
            },
            additionalFilter
        ]
    }
    return {
        type: "table-view",
        title: name,
        source: {
            type: "contracts",
            filter: filter,
            search: "",
            sort: [
                {
                    field: "id",
                    direction: "ASCENDING"
                }
            ]
        },
        columns: columns
    };
}


function formatIfNum(val) {
    var n = Number(val);
    if (Number.isNaN(n)) return val;
    else return n.toLocaleString();
}

function valueFunction(rowData, key, proj) {
    return (
        proj == null
        ?
        (
            Array.isArray(DamlLfValue.toJSON(rowData.argument)[key])
            ?
            DamlLfValue.toJSON(rowData.argument)[key].join(", ")
            :
            (
                key == "id"
                ?
                rowData.id
                :
                formatIfNum(DamlLfValue.toJSON(rowData.argument)[key])
            )
        )
        :
        formatIfNum(proj(DamlLfValue.toJSON(rowData.argument))));
}

// inserts spaces into the usually camel-case key
// e.g. "assetISINCode" -> "Asset ISIN Code"
function toTitle(key) {
    var spaced = key.replace(/([^A-Z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][^A-Z])/g, '$1 $2');
    return spaced[0].toUpperCase() + spaced.substr(1)
}

function getObjectProp1(o) {
    return Object.keys(o)[0];
}

var formatTime = function(timestamp) { return timestamp.substring(0, 10) + " " + timestamp.substring(11, 16); };
var formatDate = function(timestamp) { return timestamp.substring(0, 10); };
var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];
var formatDateIntoDDMMMYYYY = function(date) { return date.substring(8,10) + " " + month_names[date.substring(5,7)-1] + ", " + date.substring(0,4); };
var formatDateIntoAMPM = function(hours, minutes) {
    var hours = parseInt(hours), minutes = parseInt(minutes);
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
  
  