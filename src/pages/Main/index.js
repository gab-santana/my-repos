import React, { useState, useCallback, useEffect } from 'react';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa';
import { Container, Form, SubmitButton, List, DeleteButton } from './styles';
import { Link } from 'react-router-dom';

import api from '../../services/api';

export default function Main() {

  const initialRepositories = JSON.parse(window.localStorage.getItem('repos'))
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState(initialRepositories);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Buscar
  useEffect(() => {
    const repoStorage = localStorage.getItem('repos');

    if (repoStorage) {
      setRepositories(JSON.parse(repoStorage));
    }
  }, []);


  // Salvar alterações
  useEffect(() => {
    localStorage.setItem('repos', JSON.stringify(repositories));
  }, [repositories]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    async function submit() {
      setLoading(true);
      setAlert(null);
      try {

        if (newRepo === '') {
          throw new Error('Você precisa indicar um repositorio!');
        }

        const response = await api.get(`repos/${newRepo}`);

        const hasRepo = repositories.find(repo => repo.name === newRepo);

        if (hasRepo) {
          throw new Error('Repositorio Duplicado');
        }

        const data = {
          name: response.data.full_name,
        }

        setRepositories([...repositories, data]);
        setNewRepo('');
      } catch (error) {
        setAlert(true);
        console.log(error);
      } finally {
        setLoading(false);
      }

    }

    submit();

  }, [newRepo, repositories]);

  function handleinputChange(e) {
    setNewRepo(e.target.value);
    setAlert(null);
  }

  const handleDelete = useCallback((repo) => {
    const find = repositories.filter(r => r.name !== repo);
    setRepositories(find);
  }, [repositories]);


  return (
    <Container>

      <h1>
        <FaGithub size={25} />
        Meus Repositorios
      </h1>

      <Form onSubmit={handleSubmit} error={alert}>
        <input
          type="text"
          placeholder="Adicionar Repositorios"
          value={newRepo}
          onChange={handleinputChange}
        />

        <SubmitButton loading={loading ? 1 : 0}>
          {loading ? (
            <FaSpinner color="#FFF" size={14} />
          ) : (
            <FaPlus color="#FFF" size={14} />
          )}
        </SubmitButton>

      </Form>

      <List>
        {repositories.map(repo => (
          <li key={repo.name}>
            <span>
              <DeleteButton onClick={() => handleDelete(repo.name)}>
                <FaTrash size={14} />
              </DeleteButton>
              {repo.name}
            </span>
            <Link to={`/repositories/${encodeURIComponent(repo.name)}`}>
              <FaBars size={20} />
            </Link>
          </li>
        ))}
      </List>

    </Container >
  )
}