// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import { useEffect, useState } from 'react';
import { MoneriumClient, AuthContext } from '@monerium/sdk';

export function App() {
  const [authCtx, setAuthCtx] = useState<AuthContext | null>(null);
  const [monerium, setMonerium] = useState<MoneriumClient>();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const sdk = new MoneriumClient({
      environment: 'sandbox',
      clientId: 'f99e629b-6dca-11ee-8aa6-5273f65ed05b',
      redirectUrl: 'http://localhost:4200',
    });
    setMonerium(sdk);
  }, []);

  useEffect(() => {
    const connect = async () => {
      if (monerium) {
        setIsAuthorized(await monerium.getAccess());
      }
    };

    connect();

    return () => {
      if (monerium) {
        monerium.disconnect();
      }
    };
  }, [monerium]);

  useEffect(() => {
    const fetchData = async () => {
      if (monerium && isAuthorized) {
        try {
          setAuthCtx(await monerium.getAuthContext());
        } catch (err) {
          console.error('Error fetching data:', err);
        }
      }
    };
    fetchData();

    const uploadFile = async (file: File) => {
      console.log(
        '%c file to upload',
        'color:white; padding: 30px; background-color: darkgreen',
        file
      );

      const fileUploaded = await monerium?.uploadSupportingDocument(
        file as File
      );
      console.log(
        '%c fileUploaded',
        'color:white; padding: 30px; background-color: darkgreen',
        fileUploaded
      );
    };

    document
      ?.getElementById('fileInput')
      ?.addEventListener('change', function (event) {
        const file = (event?.target as any)?.files?.[0];
        uploadFile(file);
      });
  }, [monerium, isAuthorized]);

  return (
    <div>
      <p>Welcome sdk-example-react</p>
      {!isAuthorized && (
        <button
          onClick={() =>
            monerium?.authorize({
              // address: '0xValidAddress72413Fa92980B889A1eCE84dD',
              // signature: '0x',
              // chainId: 137,
            })
          }
        >
          Connect
        </button>
      )}

      <p>{authCtx?.name || authCtx?.email}</p>
      {isAuthorized && <input type="file" id="fileInput"></input>}
    </div>
  );
}

export default App;
