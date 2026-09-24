from client import FoundryClient


def main() -> None:
    client = FoundryClient()
    system_prompt = (
        'Tu es un assistant de test technique. Utilise le tool calculate pour '
        'faire les calculs. Reponds ensuite en francais, en une phrase courte.'
    )
    user_query = 'Calcule 12 multiplie par 15, puis ajoute 30 au resultat.'

    print(f'Query: {user_query}')
    answer = client.query(system_prompt, user_query)
    print(f'Answer: {answer}')


if __name__ == '__main__':
    main()