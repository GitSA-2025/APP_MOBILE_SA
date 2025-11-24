import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },

  contentContainer: {
    padding: 20,
  },

  registrosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },

  registrosTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B202A',
  },

  createEntryButton: {
    backgroundColor: '#963232',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },

  createEntryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },

  tableContainer: {
    borderWidth: 1,
    borderColor: '#2B3D52',
    borderRadius: 10,
    overflow: 'hidden',
  },

  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#2B3D52',
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },

  tableHeaderCell: {
    fontWeight: '700',
    color: '#2B3D52',
  },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#2B3D52',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  tableCell: {
    color: '#000000',
    fontWeight: '400',
  },

  cellDate: {
    flex: 1.1,
  },

  cellName: {
    flex: 1.6,
  },

  cellStatus: {
    flex: 1.3,
  },

  cellTime: {
    flex: 1.3,
    textAlign: 'center',
  },

  cellPlate: {
    flex: 1.4,
    textAlign: 'center',
  },

  cellEdit: {
    flex: 1.4,
    textAlign: 'right',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    justifyContent: 'center',
  },

  statusLiberado: {
    backgroundColor: '#2AA852',
  },

  statusPendente: {
    backgroundColor: '#7E99B3',
  },

  statusText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 6,
  },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#84786F',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },

  editButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 6,
  },

  exitButton: {
    backgroundColor: '#d61818ff',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6
  },

  exitButtonText: {
    color: '#fff',
    fontWeight: '600'
  },

  modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    modalContainer: {
        width: width * 0.8,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default styles;
