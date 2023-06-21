import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const WorkoutGrid = (props) => {
  const workout = props.workout;
  const exclude = props.exclude || [];

  const isJSONEmpty = (jsonData) => {
    return !jsonData || Object.keys(jsonData).length === 0;
  };

  const formatObject = (obj, _end_ = "") => {
    if (obj instanceof Array) {
      // obj is array
      return obj.map((o) => formatObject(o));
    } else if (typeof obj !== "object") {
      // obj is native
      return <>{obj}</>;
    } else {
      // obj is json
      return Object.keys(obj).map((k) => {
        return (
          <>
            {k !== "Date" && k !== "Workout" && !exclude.includes(k) && (
              <p>
                <strong>{`${k}${_end_}`}</strong>
                <br />
                {formatObject(obj[k])}
              </p>
            )}
          </>
        );
      });
    }
  };

  const getColNumber = (length) => {
    if (length < 5) return 12 / length;
    else return 4;
  };

  return (
    <>
      {!isJSONEmpty(workout) && (
        <Container id="workout-container">
          {Object.keys(workout).map((key) => {
            return (
              <>
                <h5>{key}</h5>
                <Row key={key}>
                  {Object.keys(workout[key]).map((_key, i) => (
                    <Col
                      xs={getColNumber(Object.keys(workout[key]))}
                      sm={getColNumber(Object.keys(workout[key]))}
                      key={_key}
                    >
                      <strong>{_key}</strong>
                      <br />
                      {workout[key][_key].Date && (
                        <p>
                          <strong>Date:</strong>
                          <br />
                          {workout[key][_key].Date}
                        </p>
                      )}
                      {workout[key][_key].Workout && (
                        <p>
                          <strong>Workout:</strong>
                          <br />
                          {workout[key][_key].Workout}
                        </p>
                      )}
                      {formatObject(workout[key][_key], ":")}
                    </Col>
                  ))}
                </Row>
              </>
            );
          })}
        </Container>
      )}
      {isJSONEmpty(workout) && (
        <strong className="error-message">
          We did not find any workout under your account.
          <br />
          <br />
          If this is an error, please contact your
          <br />
          System Administrator.
        </strong>
      )}
    </>
  );
};

export default WorkoutGrid;
