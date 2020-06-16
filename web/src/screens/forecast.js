/** @jsx jsx */
/** @jsxFrag React.Fragment **/
import React from "react";
import { jsx } from "@emotion/core";
import {ListForecast} from '../components/list-forecast'
import {useAddBeachToForecast, useForecast, useBeaches} from '../utils/forecast-hooks';
import {useAsync} from '../utils/use-async';
import {Map} from '../components/Map/Map'
import {FormField, SelectField, InfoMessage, PrimaryButton, ErrorMessage} from "../components/misc";
// import {Modal, ModalDismissButton} from "./components/modal";
// const closeModal = (
//   <div css={{display: 'flex', justifyContent: 'flex-end'}}>
//     <ModalDismissButton>
//       <button>
//         {/* <VisuallyHidden>Close</VisuallyHidden> */}
//         <span aria-hidden>×</span>
//       </button>
//     </ModalDismissButton>
//   </div>
// )
// {/* <Modal
//             aria-label="Login form"
//             button={<PrimaryButton>Login</PrimaryButton>}
//           >
//             {closeModal}
//             <h3>Login</h3> */}
//              {/* {/* </Modal>
//           // <Modal
//           //   aria-label="Register form"
//           //   button={<SubtleButton onClick={() => console.log('hi')}>Register</SubtleButton>}
//           // >
//           //   {closeModal}
//           //   <h3>Register</h3>
            
//           // </Modal> */}

function RegisterBeachForm({onSubmit, submitButton}) {
    const {isLoading, isError, error, run} = useAsync();

    function handleSubmit(event) {
        event.preventDefault();
        const {name, lat, lng, position} = event.target.elements;
        run(onSubmit({
            name:name.value,
            lat: parseFloat(lat.value),
            lng: parseFloat(lng.value),
            position: position.value,
        }))
    }

    return (
        <div css={{
            width: '40%',
            paddingLeft: '2em',
            boxSizing: 'border-box',
        }}>
            <form onSubmit={handleSubmit} css={{
                    backgroundColor: '#eee',
                    padding: '1em',
            }}>
                <FormField label="Beach name" id="name" type="text" name="name" placeholder="Casino" required={true} />
                <FormField inline label="Latitude" id="lat" type="text" name="lat" placeholder="-33.126080" required={true} />
                <FormField inline label="Longitude" id="lng" type="text" name="lng" placeholder="-52.639327" required={true} />
                <SelectField label="Position" id="position" type="select" options={['North', 'South', 'Lest', 'West']} name="position" />
                
                <div css={{display: 'flex', justifyContent: 'center'}}>
                    {React.cloneElement(
                        submitButton, 
                        {type: 'submit'},
                        ...(Array.isArray(submitButton.props.children) ? submitButton.props.children : [submitButton.props.children]),
                        isLoading ? <div>loading...</div> : null,
                    )}
                </div>
                {isError ? <ErrorMessage error={error} /> : null} 
            </form>
        </div>
    )
}

function ForecastScreen() {
    // const [showForm, setShowForm] = useState(false);
    const forecast = useForecast();
    const beaches = useBeaches();
    const [handleAddBeach] = useAddBeachToForecast();

    if (!forecast) {
        return 'loading...'
    }

    return (
        <div css={{margin: '1em'}}>
            <div css={{display: 'flex'}}>
                <div css={{width: '60%'}}>
                    <ListForecast
                        filterListItems={li => new Date(li.time).getHours() % 6 === 0}
                        noListItems={(<InfoMessage><p>You haven't added beaches yet, let's do it!</p></InfoMessage>)}
                        noFilteredlistitems={<p>no items filtered</p>}
                    />
                </div>
                {/* <PrimaryButton>+ Add beach</PrimaryButton> */}
                <RegisterBeachForm onSubmit={handleAddBeach} submitButton={<PrimaryButton align="right">Add beach</PrimaryButton>} />
            </div>
            {beaches && <Map beaches={beaches} styles={{minWidth: '500px', minHeight: '500px', width: '50%'}} /> }
        </div>
    )
}

export {ForecastScreen}



        