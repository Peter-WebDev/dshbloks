interface ErrorMessageProps {
    error?: string;
}

export default function ErrorMessage(props: ErrorMessageProps) {
    return (
        <span class="error-message">{props.error}</span>
    );
};