import React, { useState, useEffect } from 'react';
import { Button, Card, Typography } from '@mui/material';
import Swal from 'sweetalert2'; import { useSearchParams } from 'react-router-dom';
import { BankRoutes, Kartica, TransakcijaKarticePrikaz } from '../../utils/types';
import { getJWT, makeApiRequest, makeGetRequest } from '../../utils/apiRequest';
import ListaTransakcija from './ListaTransakcija';
import { getMe } from '../../utils/getMe';

const updateKarticaStatus = async (number: string, status: string): Promise<boolean> => {
  const result = await makeApiRequest(`${BankRoutes.cards}/${status}/${number}`, "GET", undefined, undefined, true);
  console.log(result);
  return result ? true : false
};

export default function DetaljiKartice() {
  const [kartica, setKartica] = useState<Kartica | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [transakcije, setTransakcije] = useState<TransakcijaKarticePrikaz[]>([])

  // Ovo će biti ID kartice dobijen iz URL-a
  let [searchParams, setSearchParams] = useSearchParams();
  const number = searchParams.get("number");
  const me = getMe();

  
  useEffect(() => {
    if (number) {
      console.log(number);
      const data = localStorage.getItem('selectedKartica');
      if (data) {
        const kartica = JSON.parse(data)
        setKartica(kartica)
      }

      //ne postoje jos uvek
      /*makeGetRequest("/cards/transactions/" + id)
        .then((result) => {
          console.log(result);
          if (!result)
            return alert("Greška pri preuzimanju transakcija");

          setTransakcije(result);
        })
        .catch((e) => {
          alert("Greška pri preuzimanju transakcija");
        });*/
    }
  }, [number]);

  const handleStatusChange = async (newStatus: string) => {
    if (kartica && await updateKarticaStatus(kartica.number, newStatus)) {
      Swal.fire('Uspeh!', `Kartica je ${newStatus}.`, 'success');
      if (newStatus != 'blokirana' && newStatus != 'aktivna' && newStatus != 'deaktivirana')
        return;
      setKartica({ ...kartica, status: newStatus });
    } else {
      Swal.fire('Greška!', 'Promena statusa nije uspela.', 'error');
    }
  };

  if (!kartica) return <div>Učitavanje...</div>;

  return (<div style={{ width: "70%", margin: "auto" }}>
    <Card style={{ padding: '20px', maxWidth: '600px', margin: 'auto', marginBottom: 20, marginTop: 20 }}>
      <Typography variant="h5">{kartica.name}</Typography>
      <Typography>Broj kartice: {showDetails ? kartica.number : `${kartica.number.substring(0, 4)} xxxx xxxx ${kartica.number.substring(12)}`}</Typography>
      <Typography>Vrsta kartice: {kartica.type}</Typography>
      <Typography>Datum kreiranja: {new Date(kartica.creationDate).toLocaleDateString()}</Typography>
      <Typography>Datum isteka: {new Date(kartica.expirationDate).toLocaleDateString()}</Typography>
      <Typography>Broj računa: {kartica.bankAccountNumber}</Typography>
      <Typography>CVV: {showDetails ? kartica.cvv : 'xxx'}</Typography>
      <Typography>Limit: {kartica.cardLimit}</Typography>
      <Typography>Status: {kartica.status}</Typography>
      <Button onClick={() => setShowDetails(!showDetails)}>{showDetails ? "Sakrij informacije" : "Prikaži informacije"}</Button>
      {me?.permission ? kartica.status !== 'aktivna' && <Button onClick={() => handleStatusChange('aktivna')}>Aktiviraj</Button> : null}
      {me?.permission ? kartica.status !== 'deaktivirana' && <Button onClick={() => handleStatusChange('deaktivirana')}>Deaktiviraj</Button> : null}
      {kartica.status !== 'blokirana' && <Button onClick={() => handleStatusChange('blokirana')}>Blokiraj</Button>}
    </Card>
    <ListaTransakcija transakcije={transakcije}></ListaTransakcija>
  </div>
  );
}
