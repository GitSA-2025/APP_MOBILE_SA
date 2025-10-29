import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },

  contentContainer: {
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 20,
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B202A',
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

  cellEdit: {
    flex: 1.4,
    textAlign: 'right',
  },

  aprovButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0da70dff',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    margin: 20
  },

  negButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b61616ff',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    margin: 20
  },

  buttonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 6,
  },

});

export default styles;
