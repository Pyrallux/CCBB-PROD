import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

interface Data {
  name: string;
  date: string;
  asignee: string;
  binList: string[];
}

function CycleSheet({ name, date, asignee, binList }: Data) {
  const styles = StyleSheet.create({
    page: {
      margin: ".5in",
    },
    header: {
      flexDirection: "column",
      width: "7.5in",
      height: "1.4in",
      textAlign: "left",
    },
    smallText: {
      fontSize: "10px",
    },
    tableHeader1: {
      width: "3.75in",
      height: ".5in",
      border: "1px",
      textAlign: "center",
    },
    largeText1: {
      paddingTop: ".1in",
      textDecoration: "underline",
    },
    tableHeader2: {
      border: "1px",
      borderTop: "0",
      height: ".4in",
      textAlign: "center",
    },
    largeText2: {
      paddingTop: ".05in",
      fontSize: "16px",
    },

    partList: {
      width: "3.75in",
      height: "8.6in",
      borderTop: "0",
    },
    tableCell: {
      height: ".344in",
      border: "1px",
      borderTop: "0",
      textAlign: "center",
    },
    binText: {
      paddingTop: ".04in",
      fontSize: "14px",
    },
  });

  const getThreeTerms = (list: string[], index: number) => {
    if (list.length >= 3) {
      list = list.slice(0 + 3 * (index - 1), 3 + 3 * (index - 1));
    }
    let numBlanksToAdd: number = Math.floor((25 - list.length) / list.length);
    let returnList: string[] = [];
    for (let i = 0; i < list.length; i++) {
      returnList.push(list[i]);
      for (let j = 0; j < numBlanksToAdd; j++) {
        returnList.push("");
      }
    }
    while (returnList.length < 25) {
      returnList.push("");
    }
    return returnList;
  };

  return (
    <Document>
      {[...Array(Math.ceil(binList.length / 3))].map((_, pageIndex) => (
        <Page size="LETTER" style={styles.page}>
          <View style={styles.header}>
            <View style={{ flexDirection: "row", paddingBottom: ".05in" }}>
              <Text style={[styles.smallText, { width: "3.25in" }]}>
                Count Person: {asignee}
              </Text>
              <Text style={[styles.smallText, { width: "3.15in" }]}>
                Bay Count Sheet
              </Text>
              <Text style={[styles.smallText, { width: "1.1in" }]}>
                Page: {pageIndex + 1}
              </Text>
            </View>
            <View style={{ flexDirection: "row", paddingBottom: ".05in" }}>
              {pageIndex === 0 ? (
                <Text style={[styles.smallText, { width: "3.45in" }]}>
                  Data Submitted By: _______________
                </Text>
              ) : (
                <Text style={[styles.smallText, { width: "3.45in" }]}></Text>
              )}

              <Text style={[styles.smallText, { width: "2.95in" }]}>
                Bay: {name}
              </Text>
              <Text style={[styles.smallText, { width: "1.1in" }]}>
                Date: {date}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingTop: ".1in",
              }}
            >
              <View style={styles.tableHeader1}>
                <Text style={styles.largeText1}>Physically Present Parts:</Text>
              </View>
              <View style={styles.tableHeader1}>
                <Text style={styles.largeText1}>
                  Parts in Inventory System:
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View
                style={[
                  styles.tableHeader2,
                  {
                    width: ".95in",
                    borderRight: "0",
                  },
                ]}
              >
                <Text style={styles.largeText2}>Bin</Text>
              </View>
              <View
                style={[
                  styles.tableHeader2,
                  {
                    width: "2in",
                    borderRight: "0",
                  },
                ]}
              >
                <Text style={styles.largeText2}>Part Number</Text>
              </View>
              <View
                style={[
                  styles.tableHeader2,
                  {
                    width: ".8in",
                  },
                ]}
              >
                <Text style={styles.largeText2}>QTY</Text>
              </View>
              <View
                style={[
                  styles.tableHeader2,
                  {
                    width: ".95in",
                    borderRight: "0",
                  },
                ]}
              >
                <Text style={styles.largeText2}>Bin</Text>
              </View>
              <View
                style={[
                  styles.tableHeader2,
                  {
                    width: "2in",
                    borderRight: "0",
                  },
                ]}
              >
                <Text style={styles.largeText2}>Part Number</Text>
              </View>
              <View
                style={[
                  styles.tableHeader2,
                  {
                    width: ".8in",
                  },
                ]}
              >
                <Text style={styles.largeText2}>QTY</Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.partList}>
              <View style={{ flexDirection: "column" }}>
                {getThreeTerms(binList, pageIndex + 1).map((bin) => (
                  <>
                    {bin !== "" ? (
                      <View style={{ flexDirection: "row" }}>
                        <View
                          style={[
                            styles.tableCell,
                            {
                              width: ".95in",
                              borderRight: "0",
                              borderTop: "1px",
                            },
                          ]}
                        >
                          <Text style={styles.binText}>{bin}</Text>
                        </View>
                        <View
                          style={[
                            styles.tableCell,
                            {
                              width: "2in",
                              borderRight: "0",
                              borderTop: "1px",
                            },
                          ]}
                        ></View>
                        <View
                          style={[
                            styles.tableCell,
                            { width: ".8in", borderTop: "1px" },
                          ]}
                        ></View>
                      </View>
                    ) : (
                      <View style={{ flexDirection: "row" }}>
                        <View
                          style={[
                            styles.tableCell,
                            {
                              width: ".95in",
                              borderRight: "0",
                            },
                          ]}
                        >
                          <Text style={styles.binText}>{bin}</Text>
                        </View>
                        <View
                          style={[
                            styles.tableCell,
                            { width: "2in", borderRight: "0" },
                          ]}
                        ></View>
                        <View
                          style={[styles.tableCell, { width: ".8in" }]}
                        ></View>
                      </View>
                    )}
                  </>
                ))}
              </View>
            </View>
            <View style={styles.partList}>
              <View style={{ flexDirection: "column" }}>
                {getThreeTerms(binList, pageIndex + 1).map((bin) => (
                  <>
                    {bin !== "" ? (
                      <View style={{ flexDirection: "row" }}>
                        <View
                          style={[
                            styles.tableCell,
                            {
                              width: ".95in",
                              borderRight: "0",
                              borderTop: "1px",
                            },
                          ]}
                        >
                          <Text style={styles.binText}>{bin}</Text>
                        </View>
                        <View
                          style={[
                            styles.tableCell,
                            {
                              width: "2in",
                              borderRight: "0",
                              borderTop: "1px",
                            },
                          ]}
                        ></View>
                        <View
                          style={[
                            styles.tableCell,
                            { width: ".8in", borderTop: "1px" },
                          ]}
                        ></View>
                      </View>
                    ) : (
                      <View style={{ flexDirection: "row" }}>
                        <View
                          style={[
                            styles.tableCell,
                            {
                              width: ".95in",
                              borderRight: "0",
                            },
                          ]}
                        >
                          <Text style={styles.binText}>{bin}</Text>
                        </View>
                        <View
                          style={[
                            styles.tableCell,
                            { width: "2in", borderRight: "0" },
                          ]}
                        ></View>
                        <View
                          style={[styles.tableCell, { width: ".8in" }]}
                        ></View>
                      </View>
                    )}
                  </>
                ))}
              </View>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
}

export default CycleSheet;
