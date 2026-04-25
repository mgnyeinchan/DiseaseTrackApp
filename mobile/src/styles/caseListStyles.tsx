import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 15,
  },

  addBtn: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },

  addText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  age: {
    color: '#666',
    marginBottom: 10,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  btn: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 5,
  },

  editBtn: {
    backgroundColor: '#28a745',
  },

  deleteBtn: {
    backgroundColor: '#dc3545',
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});