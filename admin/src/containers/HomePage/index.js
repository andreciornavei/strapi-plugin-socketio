import React, { memo, useEffect, useState } from 'react';
import pluginId from '../../pluginId';
import { VscSyncIgnored } from "react-icons/vsc"
import { Table, Button } from '@buffetjs/core';
import { Header } from '@buffetjs/custom';
import {
  useGlobalContext,
  ContainerFluid,
  request
} from 'strapi-helper-plugin';

const headers = [
  {
    name: 'Id',
    value: 'id'
  },
  {
    name: 'Socket',
    value: 'socket_id'
  },
  {
    name: 'Username',
    value: 'username'
  },
  {
    name: 'Email',
    value: 'email'
  }, {
    name: "Actions"
  }
];

const CustomRow = ({ row }) => {
  const { id, socket_id, username, email } = row;
  return (
    <tr>
      <td>
        {id}
      </td>
      <td>
        {socket_id}
      </td>
      <td>
        {username}
      </td>
      <td>
        {email}
      </td>
      <td width="150">
        <Button color="secondary" onClick={() => {
          disconnect(data.id)
        }}><VscSyncIgnored size={16} /> kill</Button>
      </td>
    </tr>
  );
};


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

      <Header
        actions={[
          {
            label: "Atualizar",
            color: 'secondary',
            type: 'button',
            onClick: () => { fetchConnections() }
          },
        ]}
        title={{
          label: 'Socket.IO',
        }}
        content="Monitoramento das conexões com socket." />

      <div className="alert alert-success">
        <b>Como funciona?</b> Este plugin registra todos os usuários conectados em memória,
        também expõe o <b>socket.io</b> por meio da variável <b>strapi.io</b> ficando acessível em
        qualquer controller/service da sua aplicação. Toda vêz que você desejar enviar uma notificação
        a outro usuário, basta utilizar o comando <b><code>"await strapi.io.send("USER_ID/ROOM_ID", "EVENT", "MESSAGE")"</code></b>,
        se o usuário estiver conectado, ele receberá a notificação.
      </div>

      {connections.length == 0 &&
        <div className="container-fluid text-center border shadow-sm bg-light">
          <p className="p-5 text-secondary">Sem conexões ativas no momento</p>
        </div>
      }
      {connections.length > 0 &&

        <Table
          headers={headers}
          onClickRow={(e, data) => {
            console.log(data);
          }}
          onSelect={(row, index) => { }}
          onSelectAll={() => { }}
          customRow={CustomRow}
          rows={connections}
        />
      }
    </ContainerFluid>
  );
};

export default memo(HomePage);
