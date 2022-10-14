import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useParams } from "react-router-dom";
import { Container, Owner, Loading, BackButton, IssuesList, PageActions, FilterList } from "./styles"
import { FaArrowLeft } from "react-icons/fa"

export default function Repositories() {
  const { repositorie } = useParams()
  const [repo, setRepo] = useState({})
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState([
    { state: 'all', label: 'Todas', active: true },
    { state: 'open', label: 'Abertas', active: true },
    { state: 'closed', label: 'Fechadas', active: true }
  ])
  const [filterIndex, setFilterIndex] = useState(0)

  useEffect(() => {
    async function load() {

      const nameRepo = decodeURIComponent(repositorie)

      const repoData = await api.get(`/repos/${nameRepo}`)
      const issuesData = await api.get(`/repos/${nameRepo}/issues`, {
        params: {
          state: filters.find(f => f.active).state,
          per_page: 5
        }
      })

      setRepo(repoData.data)
      setIssues(issuesData.data)
      setLoading(false)

    }


    load()
  }, [filters, repositorie])

  useEffect(() => {
    async function loadIssue() {
      const nameRepo = decodeURIComponent(repositorie)

      const response = await api.get(`/repos/${nameRepo}/issues`, {
        params: {
          state: filters[filterIndex].state,
          page,
          per_page: 5,
        }
      })
      setIssues(response.data)
    }

    loadIssue()
  }, [page, filters, filterIndex, repositorie])

  function handlePage(action) {
    setPage(action === 'back' ? page - 1 : page + 1)
  }

  function handleFilter(index) {
    setFilterIndex(index)
  }

  if (loading) {
    return (
      <Loading>
        <h1>
          Carregando...
        </h1>
      </Loading>
    )
  }

  return (
    <Container>
      <BackButton to="/">
        <FaArrowLeft color="#0d2636" size={30} />
      </BackButton>
      <Owner>
        <img
          src={repo.owner.avatar_url}
          alt={repo.owner.login}
        />
        <h1>{repo.name}</h1>
        <p>{repo.description}</p>

      </Owner>

      <FilterList active={filterIndex}>
        {filters.map((filter, index) => (
          <button
            type="button"
            key={filter.label}
            onClick={() => { handleFilter(index) }}>
            {filter.label}
          </button>
        ))}
      </FilterList>

      <IssuesList>
        {issues.map(issue => (
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login} />
            <div>
              <strong>
                <a href={issue.html_url}>{issue.title}</a>

                {issue.labels.map(label => (
                  <span key={String(label.id)}>{label.name}</span>
                ))}
              </strong>
              <p>
                {issue.user.login}
              </p>
            </div>
          </li>
        ))}
      </IssuesList>
      <PageActions>
        <button
          type="button"
          onClick={() => handlePage('back')}
          disabled={page < 2}>Voltar</button>
        <button type="button" onClick={() => handlePage('next')}>Próxima</button>
      </PageActions>
    </Container>
  )
}