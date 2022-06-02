import React from 'react';
import Icon from './UI/Icon';
import styles from './Sequence.module.css';

export default function Sequence(props) {
  const {tacticSequence, tacticsLength, onSequenceSelected, onNewSequenceAdded} = props;

  const handleSequenceClick = (sequence) => {
    onSequenceSelected(sequence);
  }

  const handleNewSequence = () => {
    onNewSequenceAdded();
  }

  const sequences = [...Array(tacticsLength).keys()];

  return (
    <div className={styles.sequenceContainer}>
      {sequences.map(sequence => (
        <div key={sequence} className={`${styles.sequence} ${tacticSequence === sequence ? styles.active : ''}`}
            onClick={() => handleSequenceClick(sequence)}>
        </div>
      ))}
      {tacticsLength < 3 && 
        <div className={`${styles.sequence} ${styles.plus}`} title="Add New Tactic"
            onClick={() => handleNewSequence()}>
          <Icon type="plus" color="white" />
        </div>
      }
    </div>
  );
}