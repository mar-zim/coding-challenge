import axios from 'axios'
import React, { useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { useForm, useFieldArray } from 'react-hook-form'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

export default function AddPeopleForm({ encounters, setEncounters }) {
  const [userLocation, setUserLocation] = useState('')
  const inputId = uuidv4()
  const { register, handleSubmit, errors, formState, control, reset } = useForm(
    {
      mode: 'onBlur',
      defaultValues: {
        friends: [{ firstName: '', lastName: '' }],
      },
    }
  )

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'friends',
  })

  function onSubmit(newEncounter) {
    console.log('Input: ', newEncounter)
    setEncounters([...encounters, newEncounter])
    reset()
  }

  function getLocation() {
    navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude
      const lon = position.coords.longitude

      axios
        .get(
          `https://eu1.locationiq.com/v1/reverse.php?key=pk.bdf564897f7c87e4a19e06e928604689&lat=${lat}&lon=${lon}&format=json`
        )
        .then((response) => response.data)
        .then((data) => setUserLocation(data.display_name))
        .catch((error) => console.log(error.message))
    })
  }

  return (
    <div>
      <h3>Add people you met</h3>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {fields.map((item, index) => {
          return (
            <div key={item.id}>
              <input
                name={`friends[${index}].firstName`}
                defaultValue={`${item.firstName}`}
                ref={register()}
                placeholder="First Name"
              />
              <input
                name={`friends[${index}].lastName`}
                defaultValue={`${item.lastName}`}
                ref={register({
                  required: true,
                })}
                placeholder="Last Name"
              />
              <button type="button" onClick={() => remove(index)}>
                x
              </button>
            </div>
          )
        })}
        <button
          type="button"
          onClick={() => {
            append({ firstName: '', lastName: '' })
          }}
        >
          Add more friends
        </button>
        {errors.friends && <div>Please enter first and last name</div>}
        <input
          type="date"
          name="date"
          ref={register({
            required: true,
          })}
          placeholder="Date"
        />
        {errors.date && <div>Please select a date</div>}
        <textarea
          name="location"
          defaultValue={userLocation}
          ref={register({
            required: true,
          })}
          placeholder="Press button below to get current location"
        />
        {errors.location && <div>Please enter a location</div>}
        <input
          name="entryId"
          type="hidden"
          defaultValue={inputId}
          ref={register()}
        />
        <button type="button" onClick={getLocation}>
          Get Location
        </button>
        <button type="submit" disabled={formState.isSubmitting}>
          Submit
        </button>
      </StyledForm>
    </div>
  )
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 5px;
`
