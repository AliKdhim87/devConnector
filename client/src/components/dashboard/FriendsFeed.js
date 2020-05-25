import React from 'react'
import { Card, Feed } from 'semantic-ui-react'

const FriendsFeed = () => (
    <Card fluid>
    <Card.Content>
      <Card.Header>Latest posts from your friends <i className="fas fa-user-friends m-1"></i></Card.Header>
    </Card.Content>
    <Card.Content>
      <Feed>
        <Feed.Event>
          <Feed.Label image='https://i7.pngguru.com/preview/362/94/461/pikachu-ash-ketchum-pokemon-art-academy-pokemon-go-pokedex-pikachu.jpg' />
          <Feed.Content>
            <Feed.Date content='1 day ago' />
            <Feed.Summary>
              You added <a>Jenny Hess</a> to your <a>coworker</a> group.
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>

        <Feed.Event>
          <Feed.Label image='https://i7.pngguru.com/preview/362/94/461/pikachu-ash-ketchum-pokemon-art-academy-pokemon-go-pokedex-pikachu.jpg' />
          <Feed.Content>
            <Feed.Date content='3 days ago' />
            <Feed.Summary>
              You added <a>Molly Malone</a> as a friend.
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>

        <Feed.Event>
          <Feed.Label image='https://i7.pngguru.com/preview/362/94/461/pikachu-ash-ketchum-pokemon-art-academy-pokemon-go-pokedex-pikachu.jpg' />
          <Feed.Content>
            <Feed.Date content='4 days ago' />
            <Feed.Summary>
              You added <a>Elliot Baker</a> to your <a>musicians</a> group.
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>
      </Feed>
    </Card.Content>
  </Card>
)

export default FriendsFeed;
