import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function HomeScreen() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [allNotes, setAllNotes] = useState();
  const user = auth().currentUser;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('notes')
      .where('userId', '==', user.uid)
      .onSnapshot(querySnapshot => {
        const notes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('notes:', notes);
        setNotes(notes);
      });

    return () => unsubscribe();
  }, []);

  const addNote = async () => {
    if (newNote.trim()) {
      await firestore().collection('notes').add({
        userId: user.uid,
        text: newNote.trim(),
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      setNewNote('');
    }
  };

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('notes')
      .onSnapshot(querySnapshot => {
        const allNotes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('All Notes:', allNotes);
        setAllNotes(allNotes);
      });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Notes</Text>
      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.note}>
            <Text style={styles.noteText}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.container}>
        <Text style={styles.title}>All Notes</Text>
        <FlatList
          data={allNotes}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.note}>
              <Text style={styles.noteText}>{item.text}</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newNote}
          onChangeText={setNewNote}
          placeholder="New Note"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.addButton} onPress={addNote}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  note: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  noteText: {
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    color: 'black',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
