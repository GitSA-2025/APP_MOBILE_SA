import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20,
    fontWeight: 'bold'
  },
  info: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#00A86B',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
    width: 500
  },
  cancelButton: {
    backgroundColor: '#d9534f'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default styles;
