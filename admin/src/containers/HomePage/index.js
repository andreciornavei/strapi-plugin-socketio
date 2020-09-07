import React, { memo, useEffect, useState } from 'react';
import pluginId from '../../pluginId';

import {
  useGlobalContext,
  PluginHeader,
  ContainerFluid,
  Button,
  auth,
  request
} from 'strapi-helper-plugin';

const listButtonStyle = {
  fontSize: "12px",
  padding: "0px 15px",
  height: "23px",
  margin: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "auto",
}

const HomePage = ({ history }) => {
  const globalContext = useGlobalContext();
  const [connections, setConnections] = useState([])

  const fetchConnections = async () => {
    const response = await request(`/${pluginId}/connections`)
    setConnections(response.connections || [])
  }

  const disconnect = async (userId) => {
    try {
      await request(`/${pluginId}/connections/${userId}`, { method: "DELETE" })
    } catch (error) { }
    fetchConnections()
  }

  useEffect(() => {
    fetchConnections()
  }, []);

  return (
    <ContainerFluid>
      <PluginHeader
        title="Socket.IO"
        description="Monitoramento das conexões com socket."
        actions={[
          {
            label: "Atualizar",
            primary: true,
            onClick: () => { fetchConnections() }
          },
        ]}
      />
      <div className="alert alert-success">
        <b>Como funciona?</b> Este plugin registra todos os usuários conectados em memória,
        também expõe o <b>socket.io</b> por meio da variável <b>strapi.io</b> ficando acessível em
        qualquer controller/service da sua aplicação. Toda vêz que você desejar enviar uma notificação
        a outro usuário, basta utilizar o comando <b><code>"await strapi.plugins['socketio'].services.notification.send("USER_ID", "CHANNEL", "MESSAGE")"</code></b>,
        se o usuário estiver conectado, ele receberá a notificação.
      </div>

      {connections.length == 0 &&
        <div className="container-fluid text-center border shadow-sm bg-light">
          <p className="p-5 text-secondary">Sem conexões ativas no momento</p>
        </div>
      }
      {connections.length > 0 &&
        <table className="shadow-sm table striped bordered hover border">
          <tr className="bg-light">
            <th>User ID</th>
            <th>Socket ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>&nbsp;</th>
          </tr>
          {connections.map((connection, index) => {
            return <tr key={index}>
              <td width={80}>{connection.id}</td>
              <td width={80}>{connection.socket_id}</td>
              <td width={80}>{connection.username}</td>
              <td>{connection.email}</td>
              <td width={80}><Button primary small label="Desconectar" style={listButtonStyle} onClick={() => disconnect(connection.id)} /></td>
            </tr>
          })}
        </table>
      }
    </ContainerFluid>
  );
};

export default memo(HomePage);
