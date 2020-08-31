import React from 'react'
import ListItem from './ListItem'

export default function EncounterList({ encounters }) {
  const sortedEncounters = encounters.slice().sort((a, b) => b.date - a.date)

  console.log(sortedEncounters)
  return (
    <>
      <h3>People you met</h3>
      {sortedEncounters.map((encounter) => (
        <ListItem encounter={encounter} key={encounter.entryId} />
      ))}
    </>
  )
}
