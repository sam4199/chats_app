export default function Feed() {
  return (
    <div style={styles.feed}>
      <div style={styles.card}>
        <h4>@john_doe</h4>
        <img
          src="https://picsum.photos/500/300"
          alt="post"
          style={styles.image}
        />
        <p>❤️ 120 likes</p>
      </div>

      <div style={styles.card}>
        <h4>@jane_smith</h4>
        <img
          src="https://picsum.photos/500/301"
          alt="post"
          style={styles.image}
        />
        <p>❤️ 98 likes</p>
      </div>
    </div>
  );
}

const styles = {
  feed: {
    padding: "20px",
    overflowY: "auto",
    flex: 1,
  },
  card: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    borderRadius: "10px",
    marginTop: "10px",
  },
};
