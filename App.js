
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, } from 'react-native';
import Contacts from 'react-native-contacts';
import { StyleSheet } from 'react-native';



const App = () => {
  const [contacts, setContacts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => {
    Contacts.getAll((err, allContacts) => {
      if (err === 'denied') {
        console.log('Permission to access contacts was denied');
      } else {
        setContacts(allContacts);
      }
    });
  };

  const searchContacts = () => {
    const filteredContacts = contacts.filter(
      contact =>
        contact.givenName.toLowerCase().includes(searchText.toLowerCase()) ||
        contact.familyName.toLowerCase().includes(searchText.toLowerCase())
    );
    return filteredContacts;
  };

  const handleContactPress = contact => {
    setSelectedContact(contact);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBox}
        placeholder="Search..."
        value={searchText}
        onChangeText={text => setSearchText(text)}
      />
      {searchContacts().map(contact => (
        <TouchableOpacity
          key={contact.recordID}
          style={styles.contactItem}
          onPress={() => handleContactPress(contact)}
        >
          <Text>{`${contact.givenName} ${contact.familyName}`}</Text>
          <Text>{contact.phoneNumbers[0].number}</Text>
        </TouchableOpacity>
      ))}
      <Modal visible={selectedContact !== null} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedContact(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.contactDetailsText}>{selectedContact?.givenName}</Text>
            <Text style={styles.contactDetailsText}>{selectedContact?.familyName}</Text>
            <Text style={styles.contactDetailsText}>
              {selectedContact?.phoneNumbers[0]?.number}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  searchBox: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
  },
  contactItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    color: 'blue',
    fontSize: 16,
  },
  contactDetailsText: {
    marginVertical: 5,
  },
});

export default App;
