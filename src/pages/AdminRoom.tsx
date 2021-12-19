import { useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';

import '../styles/room.scss';
import { database } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

type AdminRoomParams = {
  id: string;
}

export function AdminRoom() {
  const navigate = useNavigate();
  const params = useParams<AdminRoomParams>();
  const roomId = params.id;
  const {questions, title} = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    navigate('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    if(window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      const questionRef = await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={params.id}/>
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {
            questions.map(
              (qEl) =>
                <Question
                  key={qEl.id}
                  content={qEl.content}
                  author={qEl.author}
                >
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(qEl.id)}
                  >
                    <img src={deleteImg} alt="Remover pergunta" />
                  </button>
              </Question>
            )
          }
        </div>
      </main>
    </div>
  )
}